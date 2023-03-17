var dataFunctions = require('./data');
var helpers = require('./helpers');
var util = require('util');
var debug = util.debuglog('workers');

var workers = {};

workers.checkAllInitialTokens = function(){
  var cTimeNow = new Date().getTime();
  dataFunctions.list('tokens',function(err, tokens){
    if(!err && tokens && tokens.length > 0){
      tokens.forEach(function(token){
        dataFunctions.read('tokens', token, function(err, tokenObject){
          if(!err && tokenObject){
            if(cTimeNow > tokenObject.expires){
              dataFunctions.delete('tokens', token, function(err){
                if(!err){
                  return;
                }
              });
            }
          } else {
            dataFunctions.delete('tokens', token, function(err){
              if(!err){
                return;
              }
            });
          }
        });
      });
    } else {
      return;
    }
  });
};

workers.checkAllSessions = function(){
  var cTimeNow = new Date().getTime();
  dataFunctions.list('sessions',function(err, sessions){
    if(!err && sessions && sessions.length > 0){
      sessions.forEach(function(session){
        dataFunctions.read('sessions', session, function(err, sessionObject){
          if(!err && sessionObject){
            if(cTimeNow > sessionObject.expires){
              dataFunctions.delete('sessions', session, function(err){
                if(!err){
                  return;
                }
              });
            }
          } else {
            dataFunctions.delete('sessions', session, function(err){
              if(!err){
                return;
              }
            });
          }
        });
      });
    } else {
      return;
    }
  });
};

workers.checkAllInitialTokensLoop = function(){
  setInterval(function(){
    workers.checkAllInitialTokens();
  }, 1000 * 60);
};

workers.checkAllSessionsLoop = function(){
  setInterval(function(){
    workers.checkAllSessions();
  }, 1000 * 60 * 60);
};

workers.init = function(){
  console.log('\x1b[33m%s\x1b[0m','Background workers are running');
  workers.checkAllInitialTokens();
  workers.checkAllSessions();
  workers.checkAllInitialTokensLoop();
  workers.checkAllSessionsLoop();
};

module.exports = workers;
