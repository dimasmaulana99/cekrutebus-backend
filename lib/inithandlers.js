var { fork } = require('child_process');

var helpersFunctions = require('./helpers');
var dataFunctions = require('./data');
var i18nLib = require('./i18n/language.'+process.env.APP_I18N+'');

var lib = {};

lib.initialConfiguration = function(req, res){
  if(process.env.APP_RUN_MODE == 'direct'){
    if(req.body.context == 'default'){
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(200, '', {
        'Access-Control-Allow-Origin': '*', 
        'Access-Control-Allow-Headers': 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Accept,Range', 
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 
      });
      let payloadString = JSON.stringify({code: 200, message: "success", data: {}});
      res.end(payloadString);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(200, '', {
        'Access-Control-Allow-Origin': '*', 
        'Access-Control-Allow-Headers': 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Accept,Range', 
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 
      });
      let payloadString = JSON.stringify({code: 200, message: "success", data: {}});
      res.end(payloadString);
    }
  } else {
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(200, '', {
      'Access-Control-Allow-Origin': '*', 
      'Access-Control-Allow-Headers': 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Accept,Range', 
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 
    });
    let payloadString = JSON.stringify({code: 200, message: "success", data: {}});
    res.end(payloadString);
  }
};

lib.initToken = function(req, res){
  if(process.env.APP_RUN_MODE == 'direct'){
    let objDate = new Date();
    let dtString = objDate.toISOString();
    let randstr = ''+dtString+''+helpersFunctions.createRandomString(32)+'';
    let hashedstr = helpersFunctions.hash(randstr);
    let expires = Date.now() + 1000 * 60 * process.env.SESSION_TIMEOUT;
    let objectData = {'token': hashedstr, 'expires': expires};
    dataFunctions.create('tokens', hashedstr, objectData, function(errTokenCreate){
      if(!errTokenCreate){
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(200, '', {
          'Access-Control-Allow-Origin': '*', 
          'Access-Control-Allow-Headers': 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Accept,Range', 
          'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 
        });
        let payloadString = JSON.stringify({code: 200, message: "success", data: objectData});
        res.end(payloadString);
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(200, '', {
          'Access-Control-Allow-Origin': '*', 
          'Access-Control-Allow-Headers': 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Accept,Range', 
          'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 
        });
        let payloadString = JSON.stringify({code: 500, message: "error", rtmode: objData.rtmode, data: {error_message: i18nLib.TOKEN_CREATE_FAILED}});
        res.end(payloadString);
      }
    });
  } else {
    const data = ['inittoken'];
    const forkInitToken = fork(process.env.APP_INIT_FORK_DIR + 'initToken.js');
    forkInitToken.on('message', function(objData){
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(200, '', {
        'Access-Control-Allow-Origin': '*', 
        'Access-Control-Allow-Headers': 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Accept,Range', 
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 
      });
      let payloadString = JSON.stringify({code: objData.code, message: objData.message, rtmode: objData.rtmode, data: objData.data});
      res.end(payloadString);
    });
    forkInitToken.send(data);
  }
};

lib.alive = function(req, res){
  if(process.env.APP_RUN_MODE == 'direct'){
    let objDate = new Date();
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(200, '', {
      'Access-Control-Allow-Origin': '*', 
      'Access-Control-Allow-Headers': 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Accept,Range', 
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 
    });
    let payloadString = JSON.stringify({code: 200, message: "alive", rtmode: process.env.APP_RUN_MODE, data: {datetime:objDate.toISOString(), message: process.env.APP_SERVER_NAME+" is alive and safe-and-sound!"}});
    res.end(payloadString);
  } else {
    const data = ['alive'];
    const forkAlive = fork(process.env.APP_INIT_FORK_DIR + 'initAlive.js');
    forkAlive.on('message', function(objData){
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(200, '', {
        'Access-Control-Allow-Origin': '*', 
        'Access-Control-Allow-Headers': 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Accept,Range', 
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 
      });
      let payloadString = JSON.stringify({code: objData.code, message: objData.message, rtmode: objData.rtmode, data: objData.data});
      res.end(payloadString);
    });
    forkAlive.send(data);
  }
};

module.exports = lib;
