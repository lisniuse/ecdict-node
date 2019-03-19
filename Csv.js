const csv = require('csvtojson')
const _ = require('lodash');
const WordTableString = require('./lib/WordTableString');

class Csv {
  constructor(csvFilePath) {
    this.csvFilePath = csvFilePath;
    this.jsonArray = [];
    this.loaded = false;
  }

  async load(callback) {
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
          tag: object.tag
        }
        //_object.definition = eval('("' + _object.definition + '")');
        queryResult.push(_object);
      }
    }
    return new WordTableString(queryResult);
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
        if ( queryObjectValue && objectValue ) {
          let _queryObjectValue = queryObjectValue + '';
          let _objectValue = objectValue + '';
          if ( isExact ) {
            if ( queryObjectValue === objectValue ) {
              matchCount++;
            }
          } else {
            if ( _queryObjectValue.indexOf(_objectValue) !== -1 ) {
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
