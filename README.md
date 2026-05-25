## Xed-Editor Icon Pack Template

This is an icon pack template for [Xed-Editor](https://github.com/Xed-Editor/Xed-Editor). It lets you customize file, folder, and language icons used throughout the editor.
You can use this template as a starting point to build your own icon packs.

Icon packs follow a simple manifest-based structure (similar to a lookup table that maps file/folder patterns to icon assets).

> [!TIP]
> See the [documentation](https://xed-editor.github.io/Xed-Docs/docs/icon-packs/#creating-an-icon-pack) page for details on customizing the icon pack.

---

## Getting Started

Start by cloning the icon pack template:

```bash
git clone https://github.com/Xed-Editor/Icon-Template
cd Icon-Template
```

After cloning, customize the provided manifest and replace or add icon assets to define your own icon pack.

## Build and Installation

Before installing, you need to package your icon pack as a .zip file.

There are two supported approaches:

### Automatic Build
This method uses the included build script to generate a package automatically.
If you have [Node.js](https://nodejs.org/en/download) installed, run:

```bash
node build.js
```

You will find the output file under `dist/<id>-<version>.zip`.

### Manual Build
1. Ensure the manifest file is placed in the root of the project directory.
2. Include all referenced icon assets alongside it, preserving the folder structure used in the manifest.
3. Compress the entire directory into a .zip archive.

Then you can install it in Xed-Editor under **Xed-Editor → Settings → Themes → Add icon pack**.

Select your `pack.zip` file to apply the icon pack.
