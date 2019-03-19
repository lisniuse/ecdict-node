class WordTableString {
  
  constructor (objectArray) {
    let header = [];
    let body = [];
    let index = -1;
    for (const key in objectArray) {
      if (objectArray.hasOwnProperty(key)) {
        let item = objectArray[key];
        index++;
        if ( index === 0 ) {
          header = Object.keys(item);
        }
        body.push(Object.keys(item).map(key =>item[key]));
      }
    }
    return {
      header,
      body
    }
  }
}

module.exports = WordTableString;
