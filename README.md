# Foxglove Custom Depth Decoder

A specialized Foxglove Studio extension that acts as a Schema Converter to natively decode high-resolution, low-bandwidth compressed 16-bit PNG depth maps into standard `sensor_msgs/msg/Image` (16UC1) structures.

## Overview
By compressing raw depth maps as standard 16-bit PNGs (instead of using the buggy `compressedDepth` plugin in ROS 2), we achieve maximum bandwidth savings over the network. 

This extension seamlessly sits in the background and intercepts these `CompressedImage` messages. It utilizes `fast-png` to synchronously decode the raw bytes and hands them back to Foxglove's native Image Panel as a raw `16UC1` image.

### Features
- **Native Colormapping:** Because the extension converts the byte stream back to a pure `16UC1` Image, Foxglove natively lets you apply `Turbo` or `Rainbow` colormaps in the 2D Image Panel.
- **Distance Inspection:** Hover your mouse over any pixel in the panel to instantly read the depth distance.
- **Zero Overhead:** Completely sidesteps the `Invalid typed array length` bugs present in older RVL decoders.

## Installation

### Quick Install (Recommended)
You can download the latest pre-compiled `.foxe` release directly from the **Releases** page on this repository. Simply drag and drop the downloaded `.foxe` file anywhere into your Foxglove Studio window to install the extension instantly!

### From Source (Local Development)
To compile and test the extension locally inside your Foxglove Studio desktop app:
```bash
npm install
npm run local-install
```
Then press `Ctrl+R` or `Cmd+R` in Foxglove to reload the app.

## Packaging and Publishing for your Team

If you want to share this extension with the rest of your organization so it automatically installs in everyone's Foxglove Studio, you can use the built-in Foxglove CLI.

### 1. Publish to your Organization
Make sure you have logged into the Foxglove CLI (`foxglove auth login`), then simply run:

```sh
npm run publish-org
```

This custom script will automatically package your extension and upload it directly to your organization's registry. Anyone in your organization will now have this extension automatically installed!

### 2. Manual Packaging (Share without CLI)
If you just want to generate the `.foxe` file to manually email or drag-and-drop:

```sh
npm run package
```

This will generate `mcgill-robotics.foxglove-custom-depth-decoder-1.0.0.foxe`. Anyone can drag and drop this file directly into their Foxglove Studio window to install the extension instantly.

## CI/CD Pipeline
This repository includes a GitHub Actions workflow identical to other standardized extensions. 

When you push a Git tag starting with `v` (e.g., `v1.0.0`), the pipeline will automatically:
1. Setup Node.js
2. Build and package the extension into a `.foxe` artifact.
3. Automatically publish the artifact to a new GitHub Release.
