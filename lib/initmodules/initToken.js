var helpersFunctions = require('../helpers');
var dataFunctions = require('../data');
var i18nLib = require('../i18n/language.'+process.env.APP_I18N+'');

process.on('message', function(data){
  var dataArray = data, objData;
  let objDate = new Date();
  let dtString = objDate.toISOString();
  let randstr = ''+dtString+''+helpersFunctions.createRandomString(32)+'';
  let hashedstr = helpersFunctions.hash(randstr);
  let expires = Date.now() + 1000 * 60 * process.env.SESSION_TIMEOUT;
  let objectData = {token: hashedstr, expires: expires};
  dataFunctions.create('tokens', hashedstr, objectData, function(err){
    if(!err){
      objData = {code: 200, message: "success", rtmode: process.env.APP_RUN_MODE, data: objectData};
      process.send(objData);
      process.exit();
    } else {
      objData = {code: 500, message: "error", rtmode: process.env.APP_RUN_MODE, data: {error_message: i18nLib.TOKEN_CREATE_FAILED}};
      process.send(objData);
      process.exit();
    }
  });
});
