var crypto = require('crypto');
var querystring = require('querystring');

var lib = {};

lib.parseJsonToObject = function(str){
  try{
    let obj = JSON.parse(str);
    return obj;
  } catch(e){
    return {};
  }
};

lib.hash = function(str){
  if(typeof(str) == 'string' && str.length > 0){
    var hash = crypto.createHmac('sha256', process.env.HASHING_SECRET).update(str).digest('hex');
    return hash;
  } else {
    return false;
  }
};

lib.createRandomString = function(strLength){
  strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength : false;
  if(strLength){
    let possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let str = '';
    for(i = 1; i <= strLength; i++) {
      let randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
      str+=randomCharacter;
    }
    return str;
  } else {
    return false;
  }
};

/* Ref.: https://stackoverflow.com/questions/57873879/buffers-and-url-encoding-in-node-js */
lib.isUrlSafe = function(char){
  return /[a-zA-Z0-9\-_~.]+/.test(char);
};

lib.urlEncodeBytes = function(buf){
  let encoded = '';
  for (let i = 0; i < buf.length; i++) {
    const charBuf = Buffer.from('00', 'hex');
    charBuf.writeUInt8(buf[i]);
    const char = charBuf.toString();
    // if the character is safe, then just print it, otherwise encode
    if (lib.isUrlSafe(char)) {
      encoded += char;
    } else {
      encoded += `%${charBuf.toString('hex').toUpperCase()}`;
    }
  }
  return encoded;
};

lib.urlDecodeBytes = function(encoded){
  let decoded = Buffer.from('');
  for (let i = 0; i < encoded.length; i++) {
    if (encoded[i] === '%') {
      const charBuf = Buffer.from(`${encoded[i + 1]}${encoded[i + 2]}`, 'hex');
      decoded = Buffer.concat([decoded, charBuf]);
      i += 2;
    } else {
      const charBuf = Buffer.from(encoded[i]);
      decoded = Buffer.concat([decoded, charBuf]);
    }
  }
  return decoded;
};

lib.fileExtensionType = function(filetype){
  if(filetype == 'application/zip'){
    return '.zip';
  } else if(filetype == 'application/pdf'){
    return '.pdf';
  } else if(filetype == 'text/plain'){
    return '.txt';
  } else if(filetype == 'text/csv'){
    return '.csv';
  } else if(filetype == 'application/x-csv'){
    return '.csv';
  } else if(filetype == 'text/x-csv'){
    return '.csv';
  } else if(filetype == 'application/vnd.ms-excel'){
    return '.csv';
  } else if(filetype == 'image/jpeg'){
    return '.jpg';
  } else if(filetype == 'image/png'){
    return '.png';
  } else {
    return '.dat';
  }
};

lib.padWithZero = function(num, targetLength) {
  return String(num).padStart(targetLength, '0');
};

lib.generateRandomIntegerInRange = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

lib.getFromCompositeStr = function(str, separator, target) {
  var arrayComposite = str.split(separator);
  return arrayComposite[target];
};

lib.getArrayLengthFromCompositeStr = function(str, separator) {
  var arrayComposite = str.split(separator);
  return arrayComposite.length;
};

lib.parseBase64ToString = function(str){
  var tB = new Buffer.from(str, 'base64');
  var tHI = tB.toString('hex');
  var tH = new Buffer.from(tHI, 'hex');
  return ''+ tH.toString('utf8') +'';
};

lib.replaceSingleQuote = function(str, find, replace) {
  return str.replace(new RegExp(lib.escapeRegExp(find), 'g'), replace);
};

lib.escapeRegExp = function(string){
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

module.exports = lib;
