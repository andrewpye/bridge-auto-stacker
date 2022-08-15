import ExiftoolExifReader from './exif-readers/exiftool.js';
import StackCalculator from './stack-calculator.js';
import BridgeStackWriter from './stack-writers/bridge.js';

const defaultToleranceSeconds = 3;
const [_, scriptPath, targetDir, toleranceSeconds = defaultToleranceSeconds] = process.argv;

if (!targetDir) {
  console.log(`Usage: node ${scriptPath} <target directory> <tolerance in seconds (optional, default: ${defaultToleranceSeconds})>`);
  process.exit();
}

console.log(`Reading EXIF data from ${targetDir}`);
const exifReader = new ExiftoolExifReader();
const exifData = exifReader.getExifData({ targetDir });

console.log('Calculating image stacks');
const stackCalculator = new StackCalculator();
const stacks = stackCalculator.getStacks({ exifData, toleranceSeconds });

console.log('Updating Bridge');
const stackWriter = new BridgeStackWriter({ targetDir });
stackWriter.write({ targetDir, stacks });

console.log('Done!');
