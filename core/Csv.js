const csv = require('csvtojson')
const jsonlib = require('json-lib');
const _ = require('lodash');
const WordTableString = require('./WordTableString');

class Csv {
  constructor(csvFilePath) {
    this.csvFilePath = csvFilePath;
    this.jsonArray = [];
    this.loaded = false;
  }

  async load(callback) {
    if (this.loaded === true) return;
    this.jsonArray = await csv().fromFile(this.csvFilePath);
    this.model = jsonlib.model(this.jsonArray);
    this.loaded = true;
    if (typeof callback === 'function') {
      callback.call(this, this.model);
    }
  }
  
}

module.exports = Csv;
