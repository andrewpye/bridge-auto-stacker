import path from 'path';
import XmlAdapter from '../adapters/xml.js';

const bridgeSortFileName = '.BridgeSort';

export default class BridgeStackWriter {
  constructor({ targetDir }) {
    this._xmlAdapter = new XmlAdapter();
    this._bridgeSortPath = path.join(targetDir, bridgeSortFileName);
  }
  
  write({ stacks }) {
    if (!stacks?.length) {
      return;
    }

    const bridgeSortData = this._getCurrentBridgeSortData();
    this._mergeStacksIntoBridgeSortData({ stacks, bridgeSortData });

    this._updateBridgeSortData({ bridgeSortData });
  }

  _getCurrentBridgeSortData() {
    return this._xmlAdapter.read(this._bridgeSortPath) || this._initialiseBridgeSortData();
  }

  _initialiseBridgeSortData() {
    return {
      dirinfo: {
        stack: [],
      },
    };
  }

  _mergeStacksIntoBridgeSortData({ stacks, bridgeSortData }) {
    const currentStacks = bridgeSortData.dirinfo.stack;
    stacks.forEach((stack) => {
      // Filter out files that are already in a stack.
      const unstackedFiles = stack.reduce((files, fileData) => {
        if (this._findStackContainingFile({ fileName: fileData.fileName, stacks: currentStacks })) {
          console.warn(`Skipping ${fileData.fileName} because it is already in a stack`);
        } else {
          files.push(fileData);
        }

        return files;
      }, []);

      // Don't create a new stack if all (or all but 1) of its files are already in a stack.
      if (unstackedFiles.length < 2) {
        return;
      }

      // Create a new stack.
      const items = unstackedFiles.map((fileData) => {
        return {
          $: {
            key: this._getKeyForFile(fileData),
          },
        };
      });

      currentStacks.push({
        $: {
          version: '1',
          expanded: false,
          framerate: '2.0',
          framerateCS6: '2.0'
        },
        files: [{
          item: items,
        }],
      });
    });
  }

  _findStackContainingFile({ fileName, stacks }) {
    return stacks.find((stack) => {
      return stack.files[0].item.find((item) => {
        return item.$.key.startsWith(fileName);
      });
    });
  }

  _getKeyForFile({ fileName, date }) {
    return `${fileName}${this._formatDateForKey(new Date(date))}`;
  }

  _formatDateForKey(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1);
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const seconds = date.getSeconds();

    return `${year}${[month, day, hour, minute, seconds].map((n) => n.toString().padStart(2, '0')).join('')}`;
  }

  _updateBridgeSortData({ bridgeSortData }) {
    this._xmlAdapter.write(this._bridgeSortPath, bridgeSortData);
  }
}
