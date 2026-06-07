import { ExtensionContext } from "@foxglove/extension";
import { decode } from "fast-png";

export function activate(extensionContext: ExtensionContext): void {
  // We register converters for both ROS 1 and ROS 2 schema names so it works universally
  const inputSchemas = ["sensor_msgs/CompressedImage", "sensor_msgs/msg/CompressedImage"];
  
  for (const schema of inputSchemas) {
    extensionContext.registerMessageConverter({
      fromSchemaName: schema,
      toSchemaName: schema.replace("CompressedImage", "Image"),
      converter: (inputMessage: any) => {
        // Only decode if it's a PNG image (or matches our format)
        const format: string = inputMessage.format || "";
        if (!format.includes("png") && !format.includes("16UC1")) {
          // If it's not our depth PNG, we let Foxglove handle it natively
          return undefined;
        }

        try {
          // inputMessage.data is the raw PNG byte stream inside the CompressedImage
          const pngData = decode(inputMessage.data);
          
          // Construct the standard raw Image message
          return {
            header: inputMessage.header,
            height: pngData.height,
            width: pngData.width,
            encoding: "16UC1",
            is_bigendian: 0,
            step: pngData.width * 2, // 16-bit = 2 bytes per pixel
            data: new Uint8Array(pngData.data.buffer, pngData.data.byteOffset, pngData.data.byteLength), // Foxglove strict Uint8Array requirement
          };
        } catch (err) {
          console.error("Failed to decode custom depth PNG:", err);
          return undefined;
        }
      },
    });
  }
}
