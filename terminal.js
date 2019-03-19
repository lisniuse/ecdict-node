const path = require('path')
const chalk = require('chalk')
const WordTable = require('word-table')

const Csv = require('./core/Csv')
const csvFilePath = path.resolve('./database/ecdict.csv')

const writeArrow = function () {
  process.stdout.write(chalk.green('➜  ' + chalk.blue('ecdict ')));
}

const csvModel = new Csv(csvFilePath);
const csv = csvModel;

csv.load(() => {
  console.log('\ncsv文件加载完毕。查询例子：csv.get({\'word\': \'about\'})');
  writeArrow();
});

process.stdin.resume();
process.stdin.setEncoding('utf-8');
writeArrow();
process.stdin.on('data', (input) => {
  if (csv.loaded === false) {
    console.log('csv文件还未加载完毕。');
  } else {
    let result = null;
    try {
      result = eval(input);
    } catch (e) {
      console.log(chalk.red(e.message) + '\n');
    }
    if (result) {
      if (result.header && result.body) {
        let wt = new WordTable(result.header, result.body);
        console.log(wt.string());
      } else {
        console.log(result);
      }
    }
  }
  writeArrow();
});
process.stdin.on('end', function () {
  console.log('end');
});
