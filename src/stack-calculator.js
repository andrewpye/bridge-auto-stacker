export default class StackCalculator {
  getStacks({ exifData, toleranceSeconds }) {
    const sortedExifData = exifData.sort((a, b) => a.date - b.date);
    const stacks = [];

    let currentStack = [];
    let lastFileFinishTime = null;
    sortedExifData.forEach((fileData) => {
      if (!lastFileFinishTime || fileData.date <= lastFileFinishTime + (1_000 * toleranceSeconds)) {
        // File belongs to the current stack.
        currentStack.push(fileData);
      } else {
        // Current stack is finished, so add it to the list of stacks if it contains more than one file.
        if (currentStack.length > 1) {
          stacks.push(currentStack);
        }

        // Start a new stack.
        currentStack = [fileData];
      }

      lastFileFinishTime = fileData.date + (1_000 * fileData.shutterSpeedSeconds);
    });

    if (currentStack.length > 1) {
      stacks.push(currentStack);
    }

    return stacks;
  }
}
