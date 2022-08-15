import fs from 'fs';
import { Parser, Builder } from 'xml2js';

export default class XmlAdapter {
  constructor() {
    this._parser = new Parser();
    this._builder = new Builder();
  }

  read(path) {
    if (!fs.existsSync(path)) {
      return null;
    }

    const text = fs.readFileSync(path, { encoding: 'utf-8' });
    return this.parse(text);
  }

  parse(text) {
    let result;
    this._parser.parseString(text, (_, parsed) => { result = parsed });
    return result;
  }

  write(path, obj) {
    fs.writeFileSync(path, this._builder.buildObject(obj), { encoding: 'utf-8' });
  }
}
