const fs = require('fs');
const { program } = require('commander');

program
  .option('-i, --input <path>', 'шлях до вхідного файлу')
  .option('-o, --output <path>', 'шлях до вихідного файлу')
  .option('-d, --display', 'вивести результат у консоль')
  .option('-m, --mfo', 'відображати код МФО')
  .option('-n, --normal', 'відображати лише працюючі банки');

program.parse(process.argv);
const options = program.opts();

if (!options.input) {
  process.stderr.write("Please, specify input file\n");
  process.exit(1);
}

if (!fs.existsSync(options.input)) {
  process.stderr.write("Cannot find input file\n");
  process.exit(1);
}