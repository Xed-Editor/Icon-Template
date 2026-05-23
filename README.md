## Xed-Editor Icon Pack Template

This is an icon pack template for [Xed-Editor](https://github.com/Xed-Editor/Xed-Editor). It lets you customize file, folder, and language icons used throughout the editor.
You can use this template as a starting point to build your own icon packs.

Icon packs follow a simple manifest-based structure (similar to a lookup table that maps file/folder patterns to icon assets).

---

## Getting Started

Start by cloning the icon pack template:

```bash
git clone https://github.com/Xed-Editor/Icon-Template
cd Icon-Template
```

After cloning, customize the provided manifest and replace or add icon assets to define your own icon pack.

## Build and Installation

To install your icon pack in Xed-Editor, package it correctly first:

1. Ensure the manifest file is placed in the root of the project directory.
2. Include all referenced icon assets alongside it, preserving the folder structure used in the manifest.
3. Compress the entire directory into a .zip archive.

Then you can install it in Xed-Editor:

**Xed-Editor → Settings → Themes → Add icon pack**

Select your pack.zip file to apply the icon pack.

---

## Basic Structure

An icon pack is defined using a JSON manifest that maps patterns to icon files:

```json
{
  "id": "unique-icon-pack-id",
  "name": "Icon Pack Name",
  "applyTint": false,
  "icons": {
    "defaultFile": "icons/path-to-icon.svg",
    "defaultFolder": "icons/path-to-icon.svg",
    "defaultFolderExpanded": "icons/path-to-icon.svg",
    "folderNames": {
      "name-of-the-folder": "icons/path-to-icon.svg"
    },
    "folderNamesExpanded": {
      "name-of-the-folder": "icons/path-to-icon.svg"
    },
    "fileNames": {
      "name-of-the-file": "icons/path-to-icon.svg"
    },
    "fileExtensions": {
      "name-of-the-extension": "icons/path-to-icon.svg"
    },
    "languageNames": {
      "name-of-the-language-type": "icons/path-to-icon.svg"
    }
  }
}
```

---

## Top-Level Properties

| Property    | Type    | Required            | Description                                    |
| ----------- | ------- | ------------------- | ---------------------------------------------- |
| `id`        | string  | Yes                 | Unique identifier of the icon pack             |
| `name`      | string  | Yes                 | Display name of the icon pack                  |
| `applyTint` | boolean | No (default: false) | Whether icons should be tinted by the UI theme |
| `icons`     | object  | Yes                 | Icon mapping configuration                     |

---

## Icon Mapping

The icon mappings defines which icon is shown for a file/folder inside the editor.

The mappings are specified with key-value pairs:

- **Key**: the identifier (e.g. file name)
- **Value**: the **relative** path (from root directory) to the icon asset

| Field                   | Type   | Required | Description                               |
| ----------------------- |--------| -------- |-------------------------------------------|
| `defaultFile`           | string | Yes      | Default icon for files                    |
| `defaultFolder`         | string | Yes      | Default icon for folders (collapsed)      |
| `defaultFolderExpanded` | string | Yes      | Default icon for folders (expanded)       |
| `folderNames`           | object | No       | Mapping of folder names to icons          |
| `folderNamesExpanded`   | object | No       | Mapping of expanded folder names to icons |
| `fileNames`             | object | No       | Mapping of exact file names to icons      |
| `fileExtensions`        | object | No       | Mapping of file extensions to icons       |
| `languageNames`         | object | No       | Mapping of language types to icons        |

The identifiers for all icon categories have to always be lowercase. Therefore, case-sensitive file and folder mappings are not supported.

> ![NOTE]
> Only SVG files are currently supported.

> ![NOTE]
> If symbol mappings are missing, the built-in default icons are used.

---

## Icon Resolution Priority

Icon selection follows a strict priority order. The first match is always used:

#### File
1. `fileNames`
2. `fileExtensions`
3. `languageNames`
4. `defaultFile`

#### Folder
1. `folderNames`
2. `defaultFolder`

#### Folder Expanded
1. `folderNamesExpanded`
2. `defaultFolderExpanded`

If none of these are defined the built-in default icons are used.

## API Reference

This section provides detailed information about each icon category and its properties.

### defaultFile

Defines the default icon used for files.

### defaultFolder

Defines the default icon used for folders in their collapsed state.

### defaultFolderExpanded

Defines the default icon used for folders when they are expanded.

### folderNames

Maps specific folder names to custom icons.

Example:

```json
"folderNames": {
  "rust": "icons/folder-rust.svg",
  "assets": "icons/folder-assets.svg"
}
```

### folderNamesExpanded

Maps specific folder names of expanded folders to custom icons.

```json
"folderNamesExpanded": {
  "rust": "icons/folder-rust-open.svg",
  "assets": "icons/folder-assets-open.svg"
}
```

### fileNames

Maps exact file names to icons.

```json
"fileNames": {
  "readme.md": "icons/readme.svg",
  "package.json": "icons/node.svg"
}
```

### fileExtensions

Maps file extensions to icons.

```json
"fileExtensions": {
  "ts": "icons/typescript.svg",
  "js": "icons/javascript.svg"
}
```

### languageNames

Maps file types used by the editor to icon assets.

They are helpful for avoiding the need to define every single file extension individually.

These identifiers are lowercase and include both built-in and extension-defined languages.

```json
"languageNames": {
  "javascript": "icons/javascript.svg",
  "typescript": "icons/typescript.svg",
  "python": "icons/python.svg",
  "rust": "icons/rust.svg"
}
```

All current built-in file types in Xed-Editor are listed below. This list is generated from the internal [`BuiltinFileType`](https://github.com/Xed-Editor/Xed-Editor/blob/main/core/main/src/main/java/com/rk/file/BuiltinFileType.kt) registry and may change at any time. For the most up-to-date information, refer to the source code.

### File Type Table

| Identifier    | Name           | File extensions                                                                   |
|---------------|----------------|-----------------------------------------------------------------------------------|
| javascript    | JavaScript     | js, mjs, cjs, jscsrc, jshintrc, mut                                               |
| typescript    | TypeScript     | ts, mts, cts                                                                      |
| jsx           | JavaScript JSX | jsx                                                                               |
| tsx           | TypeScript JSX | tsx                                                                               |
| html          | HTML           | html, htm, xhtml, xht                                                             |
| htmx          | HTMX           | htmx                                                                              |
| css           | CSS            | css                                                                               |
| scss          | SCSS           | scss, sass                                                                        |
| less          | Less           | less                                                                              |
| json          | JSON           | json, jsonl, jsonc                                                                |
| markdown      | Markdown       | md, markdown, mdown, mkd, mkdn, mdoc, mdtext, mdtxt, mdwn                         |
| xml           | XML            | xml, xaml, dtd, plist, ascx, csproj, wxi, wxl, wxs, svg                           |
| yaml          | YAML           | yaml, yml, eyaml, eyml, cff                                                       |
| python        | Python         | py, pyi                                                                           |
| java          | Java           | java, jav, bsh                                                                    |
| groovy        | Groovy         | gsh, groovy, gradle, gvy, gy                                                      |
| c             | C              | c                                                                                 |
| cpp           | C++            | cpp, cxx, cc, c++, h, hpp, hh, hxx, h++                                           |
| csharp        | C#             | cs, csx                                                                           |
| ruby          | Ruby           | rb, erb, gemspec                                                                  |
| lua           | Lua            | lua, luau                                                                         |
| go            | Go             | go                                                                                |
| php           | PHP            | php                                                                               |
| rust          | Rust           | rs                                                                                |
| pascal        | Pascal         | p, pas                                                                            |
| zig           | Zig            | zig                                                                               |
| nim           | Nim            | nim                                                                               |
| swift         | Swift          | swift                                                                             |
| dart          | Dart           | dart                                                                              |
| rocq          | Rocq (Coq)     | v, coq                                                                            |
| kotlin        | Kotlin         | kt, kts                                                                           |
| lisp          | Lisp           | lisp, clisp                                                                       |
| shell         | Shell script   | sh, bash, zsh, fish, ksh, profile, bashrc, zshrc, etc.                            |
| windows_shell | Batch          | cmd, bat                                                                          |
| powershell    | PowerShell     | ps1, psm1, psd1                                                                   |
| smali         | Smali          | smali                                                                             |
| assembly      | Assembly       | asm                                                                               |
| cmake         | CMake          | cmakelists.txt                                                                    |
| r             | R              | r                                                                                 |
| sql           | SQL            | sql, dsql, sqllite                                                                |
| toml          | TOML           | toml                                                                              |
| ini           | INI            | ini                                                                               |
| properties    | Properties     | properties, cfg, conf, config, editorconfig, gitconfig, gitmodules, gitattributes |
| ignore        | Ignore         | gitignore, gitignore_global, gitkeep, git-blame-ignore-revs                       |
| diff          | Diff           | diff, patch, rej                                                                  |
| text          | Plain text     | txt                                                                               |
| log           | Log            | log                                                                               |
| latex         | LaTeX          | latex, tex, ltx                                                                   |
| image         | Image          | jpg, jpeg, png, gif, bmp, tiff, webp, ico, heic, heif, avif                       |
| audio         | Audio          | mp3, wav, flac, ogg, aac, m4a, wma, opus                                          |
| video         | Video          | mp4, avi, mov, mkv, webm                                                          |
| archive       | Archive        | zip, rar, 7z, tar, gz, bz2, xy                                                    |
| executable    | Executable     | exe, dll, so, dylib, bin                                                          |
| apk           | APK            | apk, xapk, apks                                                                   |

Additionally, any custom language names are possible. These will only work, however, if the extension that registers this file type is installed.
