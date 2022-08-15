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
    // Not sure whether to use -createdate or -modifydate (or if it even matters)...
    const outputBuffer = execSync(`exiftool -T -filename -modifydate -shutterspeed "${targetDir}"`);
    return outputBuffer.toString();
  }

  _parseExiftoolOutput(exiftoolOutput) {
    const outputLines = exiftoolOutput.split(/(?:\r\n|\r|\n)/g);

    return outputLines.reduce((parsedOutput, outputLine) => {
      const [fileName, date, shutterSpeed] = outputLine.split('\t');

      const fileExtension = path.extname(fileName);
      if (!extensionsToExclude.includes(fileExtension) && date && shutterSpeed) {
        parsedOutput.push({
          fileName,
          date: Date.parse(date.replace(':', '-')),
          shutterSpeedSeconds: Number(shutterSpeed),
        });
      }

      return parsedOutput;
    }, []);
  }
}
