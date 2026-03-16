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

try {
  const rawData = fs.readFileSync(options.input, 'utf8');
  let data = JSON.parse(rawData);

  if (options.normal) {
    data = data.filter(item => item.COD_STATE === 1);
  }

  const result = data.map(item => {
    return options.mfo ? `${item.MFO} ${item.FULLNAME}` : item.FULLNAME;
  }).join('\n');

  if (result) {
    if (options.display) {
      console.log(result);
    }
    if (options.output) {
      fs.writeFileSync(options.output, result);
    }
  }
} catch (err) {
  process.exit(1);
}