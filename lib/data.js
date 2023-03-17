var fs = require('fs');
var path = require('path');

var helpersFunctions = require('./helpers');
var i18nLib = require('./i18n/language.'+process.env.APP_I18N+'');

var sqlite3 = require('sqlite3').verbose();
var spatialite = require('spatialite');
var { Pool, Client } = require('pg');

var lib = {};

/* Base directory of data folder */
lib.baseDir = path.join(__dirname,'/../data/');

/* SQLite3 Database File */
lib.dbFile = lib.baseDir + process.env.SQLITE3_COMMON_DB_FILE;

/* Spatialite Database File */
lib.dbGeoFile = lib.baseDir + process.env.SPATIALITE_COMMON_DB_FILE;

/* SQLite3 Connection */
lib.sqliteconnect = new sqlite3.Database(lib.dbFile, sqlite3.OPEN_READWRITE, (err) => {
  if(err) throw err;
});

/* Spatialite Connection */
lib.spatialitedbfileconnect = new spatialite.Database(lib.dbGeoFile, spatialite.OPEN_READWRITE, (err) => {
  if(err) throw err;
});

lib.pgpool = new Pool({
  user: process.env.PGSQL_USERNAME,
  host: process.env.LOCAL_SERVER_PGSQL_HOST,
  database: process.env.PGSQL_DATABASE,
  password: process.env.PGSQL_PASSWORD,
  port: process.env.PGSQL_PORT
});

lib.create = function(dir,file,data,callback){
  fs.open(lib.baseDir+dir+'/'+file+'.json', 'wx', function(err, fileDescriptor){
    if(!err && fileDescriptor){
      var stringData = JSON.stringify(data);
      fs.writeFile(fileDescriptor, stringData,function(err){
        if(!err){
          fs.close(fileDescriptor,function(err){
            if(!err){
              callback(false);
            } else {
              callback(i18nLib.INTERNAL_DATA_ERROR_CLOSING_NEW_FILE);
            }
          });
        } else {
          callback(i18nLib.INTERNAL_DATA_ERROR_WRITING_NEW_FILE);
        }
      });
    } else {
      callback(i18nLib.INTERNAL_DATA_ERROR_CREATING_NEW_FILE);
    }
  });
};

lib.read = function(dir,file,callback){
  fs.readFile(lib.baseDir+dir+'/'+file+'.json', 'utf8', function(err,data){
    if(!err && data){
      var parsedData = helpersFunctions.parseJsonToObject(data);
      callback(false,parsedData);
    } else {
      callback(err,data);
    }
  });
};

lib.update = function(dir,file,data,callback){
  fs.open(lib.baseDir+dir+'/'+file+'.json', 'r+', function(err, fileDescriptor){
    if(!err && fileDescriptor){
      var stringData = JSON.stringify(data);
      fs.ftruncate(fileDescriptor,function(err){
        if(!err){
          fs.writeFile(fileDescriptor, stringData,function(err){
            if(!err){
              fs.close(fileDescriptor,function(err){
                if(!err){
                  callback(false);
                } else {
                  callback(i18nLib.INTERNAL_DATA_ERROR_CLOSING_EXISTING_FILE);
                }
              });
            } else {
              callback(i18nLib.INTERNAL_DATA_ERROR_WRITE_TO_EXISTING_FILE);
            }
          });
        } else {
          callback(i18nLib.INTERNAL_DATA_ERROR_TRUNCATING_FILE);
        }
      });
    } else {
      callback(i18nLib.INTERNAL_DATA_ERROR_FILE_NOT_FOUND);
    }
  });
};

lib.delete = function(dir,file,callback){
  fs.unlink(lib.baseDir+dir+'/'+file+'.json', function(err){
    callback(err);
  });
};

lib.list = function(dir,callback){
  fs.readdir(lib.baseDir+dir+'/', function(err,data){
    if(!err && data && data.length > 0){
      var trimmedFileNames = [];
      data.forEach(function(fileName){
        trimmedFileNames.push(fileName.replace('.json',''));
      });
      callback(false,trimmedFileNames);
    } else {
      callback(err,data);
    }
  });
};

module.exports = lib;
