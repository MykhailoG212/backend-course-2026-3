const fs = require('fs');
const { program } = require('commander');

program
  .configureOutput({ writeErr: () => {} }) 
  .exitOverride(); 

program
  .requiredOption('-i, --input <path>', 'шлях до вхідного файлу') 
  .option('-o, --output <path>', 'шлях до вихідного файлу')
  .option('-d, --display', 'вивести результат у консоль')
  .option('-m, --mfo', 'відображати код МФО')
  .option('-n, --normal', 'відображати лише працюючі банки');

try {
  program.parse(process.argv);
} catch (err) {
  process.stderr.write("Please, specify input file\n");
  process.exit(1);
}

const options = program.opts();

if (!options.input || typeof options.input !== 'string') {
  process.stderr.write("Please, specify input file\n");
  process.exit(1);
}

if (!fs.existsSync(options.input)) {
  process.stderr.write("Cannot find input file\n");
  process.exit(1);
}

try {
  const rawData = fs.readFileSync(options.input, 'utf8');
  
  if (!rawData.trim()) process.exit(0);

  let data = JSON.parse(rawData);

  if (options.normal) {
    data = data.filter(item => item.COD_STATE === 1);
  }

  const result = data.map(item => {
    if (options.mfo) {
      return `${item.MFO} ${item.FULLNAME}`;
    }
    return item.FULLNAME;
  }).join('\n');

  if (result) {
    if (options.display) {
      console.log(result);
    }
    if (options.output) {
      fs.writeFileSync(options.output, result, 'utf8');
    }
  }

} catch (err) {
  process.exit(1);
}