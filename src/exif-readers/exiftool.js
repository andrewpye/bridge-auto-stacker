import { execSync } from 'child_process';
import path from 'path';

const extensionsToExclude = ['.xmp'];

export default class ExiftoolExifReader {
  getExifData({ targetDir }) {
    const exiftoolOutput = this._runExiftool({ targetDir });
    return this._parseExiftoolOutput(exiftoolOutput);
  }

  _runExiftool({ targetDir }) {
    // TODO: error handling.
    const outputBuffer = execSync(`exiftool -T -filename -createdate -shutterspeed "${targetDir}"`);
    return outputBuffer.toString();
  }

  _parseExiftoolOutput(exiftoolOutput) {
    const outputLines = exiftoolOutput.split(/(?:\r\n|\r|\n)/g);

    return outputLines.reduce((parsedOutput, outputLine) => {
      const [fileName, createDate, shutterSpeed] = outputLine.split('\t');

      const fileExtension = path.extname(fileName);
      if (!extensionsToExclude.includes(fileExtension) && createDate && shutterSpeed) {
        parsedOutput[fileName] = { createDate, shutterSpeed };
      }

      return parsedOutput;
    }, {});
  }
}
