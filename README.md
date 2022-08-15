# 🥞 Bridge auto-stacker 🥞
Automatically detect sequences of images and create stacks of those sequences in Adobe Bridge.

## Motivation
I frequently shoot stacks of images for various reasons (exposure bracketing, stacking for noise reduction etc.). Bridge has the ability to automatically detect panorama and HDR sequences and stack them, but the functionality seems to be based on analysis of the image data itself rather than the time that the images were shot at. This requires Bridge to have preview data for those images, and even then it's been useless for me (running it usually just pops up a separate error message for _every single image_ in the folder 😳). After spending ages trawling through sequences shot for astrophotography checking capture times and exposure durations to manually group stacks, I decided it was time to make life easier and automate the process.

## Requirements/setup
This is a [Node.js](https://nodejs.org/) script that leverages [ExifTool](https://exiftool.org/)'s command-line interface to read image metadata. As such, you will need to have both of those installed for this to work. Once you have those:

1. Clone this repository.
2. Run `npm install`/`yarn install` to install dependencies.
3. That's it!

## Usage
The script needs to be run via `node` and passed the directory containing the images to be analysed for auto-stacking:

```
node <path to this repo>/src/index.js <path to directory to auto-stack>
```

This is slightly cumbersome. Unfortunately I wasn't able to find a way to run this directly from within Bridge, but I have set up a [Quick Action](https://support.apple.com/en-gb/guide/automator/aut73234890a/mac) on my Mac to enable it to be run on directories from Finder. So my workflow looks something like:

1. Command-click directory in Bridge.
2. Select `Reveal in Finder`.
3. Command-click directory in Finder.
4. Select `Quick Actions -> Auto-stack for Bridge`.

There is probably a similar way to configure a context menu action on other operating systems. I have exported this workflow and provided it [in this repository](https://github.com/andrewpye/bridge-auto-stacker/tree/main/Auto-stack%20for%20Bridge.workflow/) for reference.

## Disclaimer/caveats
This is a quick project intended for personal use. I haven't tested it much even in my own use case, and as such I expect that it will not work perfectly in all cases. Some known things that are less than ideal:

- Bridge does not update its stacks for a directory even after refreshing – the workaround is to either close and reopen Bridge, or to navigate to a different directory and back again;
- stack auto-detection does not work flawlessly, seemingly for images that have slower write times (e.g. those at high ISO and/or with a lot of fine detail);
- any images that are already in a stack will be skipped;
- images/stacks will not be merged, meaning that if a stack exists and the script detects that other images should be stacked with those in the existing stack, they will not be added to the stack and instead a separate stack will be created;
- the script currently contains a hard-coded list of file types to exclude from stack calculation (e.g. `.xmp` files). This list is by no means exhaustive, and files that contain the required EXIF data will still be included in the stack calculation despite possibly not being images etc.
