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
let model = {};

csv.load((_model) => {
  console.log(`\ncsv文件加载完毕。使用的是json-lib（https://github.com/lisniuse/json-lib）作为json操作类库。
1. 查询单词例子：${chalk.green('model.findSync({\'word\': \'about\'});')}
2. 查询四级词汇：${chalk.green('model.findSync({\'tag\': \/cet4\/});')}
2. 统计四级词汇：${chalk.green('model.countSync({\'tag\': \/cet4\/});')}
`);
  model = _model;
  writeArrow();
});

process.stdin.resume();
process.stdin.setEncoding('utf-8');
writeArrow();
process.stdin.on('data', (input) => {
  if (csv.loaded === false) {
    console.log('csv文件还未加载完毕，请耐心等待。');
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
