var express = require("express");
var mssql   	= require("mssql");
var bodyParser  = require("body-parser");
var rest = require('./routes');
var app  = express();

var config = require('./config');


function REST(){
    var self = this;
    self.connectMssql();
};

REST.prototype.connectMssql = function() {
    var self = this;

	var connection = new mssql.Connection(config);

	connection.connect(function(err) {
		if(err) {
          self.stop(err);
        } else {
          self.configureExpress(connection);
        }
	});
}

REST.prototype.configureExpress = function(connection) {
	var self = this;
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());
	var router = express.Router();
	app.use('/api', router);
	var rest_router = new rest(router,connection);
	self.startServer();
}

REST.prototype.startServer = function() {
	app.listen(3000,function(){
	  console.log("All right ! I am alive at Port 3000.");
	});
}

REST.prototype.stop = function(err) {
    console.log("ISSUE WITH MSSQL \n" + err);
    process.exit(1);
}

new REST();