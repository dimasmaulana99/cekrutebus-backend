var helpersFunctions = require('./helpers');
var dataFunctions = require('./data');
var i18nLib = require('./i18n/language.'+process.env.APP_I18N+'');

var lib = {};

var cpxPool = dataFunctions.pgpool;

lib.busRoutes = function(req, res){
  cpxPool.query(`SELECT json_build_object('type', 'FeatureCollection', 'features', json_agg(ST_AsGeoJSON(geotable.*)::json)) AS geojson FROM (SELECT rute.gid, rute.name, rute.operator, rute.osmid, rute.id, rute.geom FROM rute ORDER BY rute.gid) AS geotable(gid, name, operator, osmid, id, geom)`, function(errQuerySelect, resQuerySelect){
    if(errQuerySelect){
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(200, '', {
        'Access-Control-Allow-Origin': '*', 
        'Access-Control-Allow-Headers': 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Accept,Range', 
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 
      });
      let payloadString = JSON.stringify({code: 500, message: "error", data: {error_message: i18nLib.DATA_NOT_FOUND}});
      res.end(payloadString);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(200, '', {
        'Access-Control-Allow-Origin': '*', 
        'Access-Control-Allow-Headers': 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Accept,Range', 
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 
      });
      let payloadString = JSON.stringify({code: 200, message: "success", data: resQuerySelect.rows[0].geojson});
      res.end(payloadString);
    }
  });
}

lib.busStops = function(req, res){
  cpxPool.query(`SELECT json_build_object('type', 'FeatureCollection', 'features', json_agg(ST_AsGeoJSON(geotable.*)::json)) AS geojson FROM (SELECT halte.gid, halte.nama, halte.tipologi, halte.rampa, halte.parkir, halte.petugas, halte.kanopi, halte.x, halte.y, halte.id, (SELECT json_agg(photo) FROM (SELECT photos.photodir AS dir, photos.filename AS file FROM photos WHERE photos.hid = halte.id) photo) AS photos, halte.geom FROM halte ORDER BY halte.gid) AS geotable(gid, nama, tipologi, rampa, parkir, petugas, kanopi, x, y, id, photos, geom)`, function(errQuerySelect, resQuerySelect){
    if(errQuerySelect){
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(200, '', {
        'Access-Control-Allow-Origin': '*', 
        'Access-Control-Allow-Headers': 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Accept,Range', 
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 
      });
      let payloadString = JSON.stringify({code: 500, message: "error", data: {error_message: i18nLib.DATA_NOT_FOUND}});
      res.end(payloadString);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(200, '', {
        'Access-Control-Allow-Origin': '*', 
        'Access-Control-Allow-Headers': 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Accept,Range', 
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 
      });
      let payloadString = JSON.stringify({code: 200, message: "success", data: resQuerySelect.rows[0].geojson});
      res.end(payloadString);
    }
  });
}

module.exports = lib;
