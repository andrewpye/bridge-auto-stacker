import ExiftoolExifReader from './exif-readers/exiftool.js';

const [_, __, targetDir] = process.argv;

function showUsage() {
  console.log(`Usage: node ${__filename} <target directory>`);
}

if (!targetDir) {
  showUsage();
  process.exit();
}

console.log(`Reading EXIF data from ${targetDir}`);
const exifReader = new ExiftoolExifReader();
const exifData = exifReader.getExifData({ targetDir });
