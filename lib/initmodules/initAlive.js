process.on('message', function(data){
  var dataArray = data;
  var objDate = new Date();
  var objData = {code: 200, message: dataArray[0], rtmode: process.env.APP_RUN_MODE, data:{datetime:objDate.toISOString(), message: process.env.APP_SERVER_NAME+" is "+dataArray[0]+" and safe-and-sound!"}};
  process.send(objData);
  process.exit();
});
