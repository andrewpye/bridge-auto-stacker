const [_, __, targetDir] = process.argv;

function showUsage() {
  console.log(`Usage: node ${__filename} <target directory>`);
}

if (!targetDir) {
  showUsage();
  process.exit();
}
