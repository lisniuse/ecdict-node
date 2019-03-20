'use strict'

const path = require('path');
const Koa = require('koa');
const app = new Koa();
const route = require('koa-route');
const serve = require('koa-static');
const Csv = require('./core/Csv');
const csvFilePath = path.resolve('./database/ecdict.csv')
const csvModel = new Csv(csvFilePath);
const csv = csvModel;
let model = {};
csv.load((_model) => {
  model = _model;
});

const webClient = serve(path.join(__dirname) + '/web-client/dist');

const apiSearch = ctx => {
  if (csv.loaded === false) {
    ctx.response.body = {
      code: 2,
      msg: 'csv文件还未加载完毕，请耐心等待。'
    }
  } else {
    let mate = ctx.query.mate;
    let field = ctx.query.field;
    let keywords = ctx.query.keywords;
    let _keywords = keywords;
    if ( field ) {
      if ( mate === 'fuzzy' ) {
        _keywords = new RegExp(keywords);
      }
      let data = model.findSync({ [field]: _keywords});
      ctx.response.body = {
        code: 0,
        msg: '查询成功',
        data: data
      }
    }
  }
};

app.use(webClient); 
app.use(route.get('/api/serach', apiSearch));
app.listen(3000);
console.log('本地服务已启动，请使用任意浏览器打开 http://127.0.0.1:3000/ 网址。');
