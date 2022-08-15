export default class ExiftoolExifReader {
  targetDir = null;

  constructor({ targetDir }) {
    this.targetDir = targetDir;
  }

  getExifData() {
    return { someFile: 'blah' };
  }
}
