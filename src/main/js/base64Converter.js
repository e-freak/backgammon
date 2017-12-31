export default class Base64Converter {

  constructor() {}

  initialize() {}

  encodeImage(fileName) {
    var fs = require('fs');
    var data = fs.readFileSync(fileName, 'base64');
    return data;
  }
}
