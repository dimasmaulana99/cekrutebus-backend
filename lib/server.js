const express = require('express');
const path = require('path');
const app = express();

var handlerFunctions = require('./handlers');
var initHandlerFunctions = require('./inithandlers');
var authHandlerFunctions = require('./authhandlers');
var dataHandlerFunctions = require('./datahandlers');

/* Always serve static files as frontend */
app.use(express.static(path.join(__dirname, '/../public')));

/* disable this if it is in the root */
app.use(process.env.APP_BASE_DIR, express.static(path.join(__dirname, '/../public')));
app.use(express.json({limit: '50mb', extended: true}));
app.use(express.urlencoded({limit: '50mb', extended: true}));

/* enable CORS */
app.options('*', (req, res) => {
  res.writeHead(200, '', {
    'Access-Control-Allow-Origin': '*', 
    'Access-Control-Allow-Headers': 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Accept,Range,Token', 
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 
  }).end();
});

/* Request Login */
app.post('/do-login', (req, res) => {
  authHandlerFunctions.doLogin(req, res);
});
/* =========== /BASIC API GROUP ============ */

/* =========== INITIAL API GROUP =========== */
/* Request initial token for later uses */
app.post('/init-token', (req, res) => {
  initHandlerFunctions.initToken(req, res);
});

/* Check whether server is alive/not */
app.get('/alive', (req, res) => {
  initHandlerFunctions.alive(req, res);
});
/* ========== /INITIAL API GROUP =========== */
module.exports = app;
