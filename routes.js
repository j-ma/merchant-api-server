var mssql   = require("mssql");

function REST_ROUTER(router,connection,md5) {
    var self = this;
    self.handleRoutes(router,connection);
}

REST_ROUTER.prototype.handleRoutes = function(router,connection) {
    var self = this;
    router.get("/",function(req,res) {
        res.json({"Message" : "Hello World !"});
    });

    router.get("/transactions",function(req,res) {
    	var request = new mssql.Request(connection);

    	request.query(`SELECT WebPointOrderHead.OrderTime, WebPointOrderHead.SoldAmount, 
    			WebPointOrderHead.Points, WebPointOrderHead.Reference, WebCustomer.FirstName, WebCustomer.LasName,  
    			WebPointOrderHead.PointCardCode, WebPointOrderHead.Remark
			FROM WebPointOrderHead
			INNER JOIN WebCustomer
			ON WebPointOrderHead.CustomerID=WebCustomer.CustomerID`, function(err, rows) {
    		if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Success", "Users" : rows});
            }
    	});
    });
}

module.exports = REST_ROUTER;