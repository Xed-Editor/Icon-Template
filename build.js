#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const root = __dirname;
const manifestPath = path.join(root, "manifest.json");

if (!fs.existsSync(manifestPath)) {
  console.error("Error: manifest.json not found");
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

const id = manifest.id || "package";
const version = manifest.version || "1.0.0";

const outDir = path.join(root, "dist");
const zipName = `${id}-${version}.zip`;
const zipPath = path.join(outDir, zipName);

fs.mkdirSync(outDir, { recursive: true });

if (fs.existsSync(zipPath)) {
  fs.unlinkSync(zipPath);
}

/**
 * Exclusion rules
 */
const EXCLUDED_DIRS = new Set([
  "dist",
  "node_modules",
  "schema",
  ".git",
  ".gitignore",
  ".idea",
  ".vscode",
]);

const EXCLUDED_FILES = new Set([
  path.basename(__filename)
]);

function shouldExclude(fullPath) {
  const rel = path.relative(root, fullPath);
  const parts = rel.split(path.sep);

  if (parts.some(p => EXCLUDED_DIRS.has(p))) return true;

  if (EXCLUDED_FILES.has(path.basename(fullPath))) return true;

  return false;
}

function walk(dir) {
  let results = [];

  for (const file of fs.readdirSync(dir)) {
    const full = path.join(dir, file);

    if (shouldExclude(full)) continue;

    const stat = fs.statSync(full);

    if (stat.isDirectory()) {
      results = results.concat(walk(full));
    } else {
      results.push(full);
    }
  }

  return results;
}

/**
 * CRC32
 */
function crc32(buf) {
  let crc = ~0;

  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];

    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }

  return ~crc >>> 0;
}

/**
 * DOS timestamp
 */
function dosDateTime(date = new Date()) {
  const year = Math.max(date.getFullYear() - 1980, 0);

  const dosTime =
    (date.getHours() << 11) |
    (date.getMinutes() << 5) |
    (Math.floor(date.getSeconds() / 2));

  const dosDate =
    (year << 9) |
    ((date.getMonth() + 1) << 5) |
    date.getDate();

  return { dosTime, dosDate };
}

const allFiles = walk(root);

const fileRecords = [];
const centralDirectory = [];

let offset = 0;

for (const file of allFiles) {
  const relativePath = path.relative(root, file).replace(/\\/g, "/");

  console.log(`Adding ${relativePath}`);

  const data = fs.readFileSync(file);
  const compressed = zlib.deflateRawSync(data);

  const crc = crc32(data);
  const { dosTime, dosDate } = dosDateTime();

  const fileNameBuf = Buffer.from(relativePath);

  const localHeader = Buffer.alloc(30);

  localHeader.writeUInt32LE(0x04034b50, 0);
  localHeader.writeUInt16LE(20, 4);
  localHeader.writeUInt16LE(0, 6);
  localHeader.writeUInt16LE(8, 8);
  localHeader.writeUInt16LE(dosTime, 10);
  localHeader.writeUInt16LE(dosDate, 12);
  localHeader.writeUInt32LE(crc, 14);
  localHeader.writeUInt32LE(compressed.length, 18);
  localHeader.writeUInt32LE(data.length, 22);
  localHeader.writeUInt16LE(fileNameBuf.length, 26);
  localHeader.writeUInt16LE(0, 28);

  const localRecord = Buffer.concat([
    localHeader,
    fileNameBuf,
    compressed
  ]);

  fileRecords.push(localRecord);

  const centralHeader = Buffer.alloc(46);

  centralHeader.writeUInt32LE(0x02014b50, 0);
  centralHeader.writeUInt16LE(20, 4);
  centralHeader.writeUInt16LE(20, 6);
  centralHeader.writeUInt16LE(0, 8);
  centralHeader.writeUInt16LE(8, 10);
  centralHeader.writeUInt16LE(dosTime, 12);
  centralHeader.writeUInt16LE(dosDate, 14);
  centralHeader.writeUInt32LE(crc, 16);
  centralHeader.writeUInt32LE(compressed.length, 20);
  centralHeader.writeUInt32LE(data.length, 24);
  centralHeader.writeUInt16LE(fileNameBuf.length, 28);
  centralHeader.writeUInt16LE(0, 30);
  centralHeader.writeUInt16LE(0, 32);
  centralHeader.writeUInt16LE(0, 34);
  centralHeader.writeUInt16LE(0, 36);
  centralHeader.writeUInt32LE(0, 38);
  centralHeader.writeUInt32LE(offset, 42);

  const centralRecord = Buffer.concat([
    centralHeader,
    fileNameBuf
  ]);

  centralDirectory.push(centralRecord);

  offset += localRecord.length;
}

const centralDirBuffer = Buffer.concat(centralDirectory);
const centralDirOffset = offset;

offset += centralDirBuffer.length;

const endRecord = Buffer.alloc(22);

endRecord.writeUInt32LE(0x06054b50, 0);
endRecord.writeUInt16LE(0, 4);
endRecord.writeUInt16LE(0, 6);
endRecord.writeUInt16LE(allFiles.length, 8);
endRecord.writeUInt16LE(allFiles.length, 10);
endRecord.writeUInt32LE(centralDirBuffer.length, 12);
endRecord.writeUInt32LE(centralDirOffset, 16);
endRecord.writeUInt16LE(0, 20);

const zipBuffer = Buffer.concat([
  ...fileRecords,
  centralDirBuffer,
  endRecord
]);

fs.writeFileSync(zipPath, zipBuffer);

const size = fs.statSync(zipPath).size;

console.log("");
console.log("Build completed");
console.log(`Output: ${zipPath}`);
console.log(`Size: ${(size / 1024 / 1024).toFixed(2)} MB`);