const path = require('path')
const chalk = require('chalk')
const WordTable = require('word-table')
const Csv = require('./Csv')
const csvFilePath = path.resolve('./database/ecdict.csv')

const writeArrow = function() {
  process.stdout.write(chalk.green('➜  ' + chalk.blue('ecdict ')));
}

const csvModel = new Csv(csvFilePath);
const csv = csvModel;
csvModel.load(() => {
  console.log('\ncsv文件加载完毕。查询例子：csv.get({\'word\': \'about\'})');
  writeArrow();
});

process.stdin.resume();
process.stdin.setEncoding('utf-8');
writeArrow();
process.stdin.on('data', (input) => {
  if ( csvModel.loaded === false ) {
    console.log('csv文件还未加载完毕。');
  } else {
    let result = null;
    try {
      result = eval(input);
    } catch (e) {
      console.log(chalk.red(e.message) + '\n');
    }
    if ( result ) {
      if ( result.header && result.body ) {
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

// csv()
// .fromFile(csvFilePath)
// .then((jsonObj)=>{
//     console.log(jsonObj);
//     /**
//      * [
//      * 	{a:"1", b:"2", c:"3"},
//      * 	{a:"4", b:"5". c:"6"}
//      * ]
//      */ 
// })
 
// Async / await usage
// const jsonArray = await csv().fromFile(csvFilePath);