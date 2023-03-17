var { fork } = require('child_process');

var helpersFunctions = require('./helpers');
var dataFunctions = require('./data');
var i18nLib = require('./i18n/language.'+process.env.APP_I18N+'');

var lib = {};

module.exports = lib;
