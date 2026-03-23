const fs = require('fs');
const { program } = require('commander');

// 1. Налаштування виводу: кажемо Commander нічого не писати в stderr самому
program
  .configureOutput({
    writeErr: () => {} 
  })
  .exitOverride(); 

// 2. Опис параметрів
program
  .requiredOption('-i, --input [path]', 'шлях до вхідного файлу')
  .option('-o, --output <path>', 'шлях до вихідного файлу')
  .option('-d, --display', 'вивести результат у консоль')
  .option('-m, --mfo', 'відображати код МФО')
  .option('-n, --normal', 'відображати лише працюючі банки');

try {
  program.parse(process.argv);
} catch (err) {
  // Тут ми ловимо помилку відсутності -i
  if (err.code === 'commander.missingMandatoryOptionValue') {
    process.stderr.write("Please, specify input file\n");
    process.exit(1);
  }
  process.exit(1);
}

const options = program.opts();

// 3. Обробка сценарію "-i" без шляху або відсутнього файлу
// Завдяки [path], якщо написати просто "-i", options.input буде дорівнювати true
if (options.input === true || !fs.existsSync(options.input)) {
  process.stderr.write("Cannot find input file\n");
  process.exit(1);
}

try {
  const rawData = fs.readFileSync(options.input, 'utf8');
  if (!rawData.trim()) process.exit(0);

  let data = JSON.parse(rawData);

  // Фільтрація
  if (options.normal) {
    data = data.filter(item => item.COD_STATE === 1);
  }

  // Форматування
  const result = data.map(item => {
    return options.mfo ? `${item.MFO} ${item.FULLNAME}` : item.FULLNAME;
  }).join('\n');

  // Вивід
  if (result) {
    if (options.display) {
      process.stdout.write(result + '\n');
    }
    if (options.output) {
      fs.writeFileSync(options.output, result);
    }
  }
} catch (err) {
  process.exit(1);
}