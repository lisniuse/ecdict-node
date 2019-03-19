const csv = require('csvtojson')
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
    this.loaded = true;
    if (typeof callback === 'function') {
      callback.call(this, this.jsonArray);
    }
  }

  query(queryObject, isExact = false) {
    let queryResult = [];
    for (let index = 0; index < this.jsonArray.length; index++) {
      const object = this.jsonArray[index];
      if (this._isMatch(queryObject, object, isExact)) {
        let _object = {
          word: object.word,
          definition: object.definition.replace(/\\nr/g, '\n'),
          translation: object.translation.replace(/\\nr/g, '\n'),
          tag: object.tag
        }
        //_object.definition = eval('("' + _object.definition + '")');
        queryResult.push(object);
      }
    }
    let wt = new WordTableString(queryResult);
    return queryResult;
  }

  get(queryObject) {
    return this.query(queryObject, true);
  }

  _isMatch(queryObject, object, isExact = false) {
    let matchCount = 0;
    for (const key in queryObject) {
      if (queryObject.hasOwnProperty(key)) {
        let queryObjectValue = queryObject[key];
        let objectValue = object[key];
        if (queryObjectValue && objectValue) {
          let _queryObjectValue = queryObjectValue + '';
          let _objectValue = objectValue + '';
          if (isExact) {
            if (queryObjectValue === objectValue) {
              matchCount++;
            }
          } else {
            if (_queryObjectValue.indexOf(_objectValue) !== -1) {
              matchCount++;
            }
          }
        }
      }
    }
    return matchCount > 0;
  }
}

module.exports = Csv;
