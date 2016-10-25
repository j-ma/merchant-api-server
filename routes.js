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

    router.get("/todays-stats",function(req,res) {
    	var request = new mssql.Request(connection);

    	request.query(`SELECT SUM(SoldAmount) AS sales, COUNT(SoldAmount) AS visits,
    			SUM(Points) AS points
			FROM WebPointOrderHead
			WHERE DATEADD(dd, 0, DATEDIFF(dd, 0, OrderTime)) = DATEADD(dd, 0, DATEDIFF(dd, 0, GETDATE()))`, function(err, rows) {
    		if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json(rows);
            }
    	});
    });

    router.get("/recent-transactions",function(req,res) {
    	var request = new mssql.Request(connection);

    	request.query(`SELECT TOP 10 WebPointOrderHead.OrderTime, WebPointOrderHead.SoldAmount, 
    			WebPointOrderHead.Points, WebPointOrderHead.Reference, WebCustomer.FirstName, WebCustomer.LasName,  
    			WebPointOrderHead.PointCardCode, WebPointOrderHead.Remark
			FROM WebPointOrderHead
			INNER JOIN WebCustomer
			ON WebPointOrderHead.CustomerID=WebCustomer.CustomerID
			ORDER BY WebPointOrderHead.OrderTime DESC`, function(err, rows) {
    		if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json(rows);
            }
    	});
    });

    router.get("/transactions",function(req,res) {
    	var request = new mssql.Request(connection);

    	request.query(`SELECT WebPointOrderHead.OrderTime, WebPointOrderHead.SoldAmount, 
    			WebPointOrderHead.Points, WebPointOrderHead.Reference, WebCustomer.FirstName, WebCustomer.LasName,  
    			WebPointOrderHead.PointCardCode, WebPointOrderHead.Remark
			FROM WebPointOrderHead
			INNER JOIN WebCustomer
			ON WebPointOrderHead.CustomerID=WebCustomer.CustomerID
			ORDER BY WebPointOrderHead.OrderTime DESC`, function(err, rows) {
    		if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json(rows);
            }
    	});
    });

    router.get("/weekly",function(req,res) {
    	var request = new mssql.Request(connection);

    	request.query(`SELECT SUM(SoldAmount) AS value, CONVERT(VARCHAR(10),OrderTime,112) AS label
			FROM WebPointOrderHead
			WHERE OrderTime BETWEEN (GETDATE() - 7) AND GETDATE()
			GROUP BY CONVERT(VARCHAR(10),OrderTime,112)
			ORDER BY CONVERT(VARCHAR(10),OrderTime,112) ASC`, function(err, rows) {
    		if(err) {
                res.json({"Error" : true, "Message" : err});
            } else {
                res.json(rows);
            }
    	});
    });
}

module.exports = REST_ROUTER;