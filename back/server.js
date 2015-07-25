var express    = require("express");
var bodyParser = require('body-parser');
var app        = express();
var database   = require("./database");
var connection = database.connection();

connection.connect(function(err){
	if(!err) {
		console.log("Database is connected ... \n\n");  
	} else {
	    console.log("Error connecting database ... \n\n");  
	}
});

app.use(bodyParser.json());

app.get("/api", function(req, res){
	res.send('mjTables API is running');
});

app.get("/api/users",function(req,res){
	connection.query('SELECT * from user', function(err, rows) {
		if (!err){
		    res.send(rows);
		}
		else
		    console.log('Error while performing Query.');
  	});
});

app.post("/api/users",function(req,res){
	var post = {
		username : req.body.username,
		password : req.body.password,
		email    : req.body.email
	};
	connection.query("INSERT INTO user SET ?", post, function(err, result){
		if(err) throw err;
		res.send({id: result.insertId})
	})
});

app.get("/api/users/:id",function(req,res){
	connection.query('SELECT * from user where id = ?', [req.params.id] , function(err, rows) {
		if (!err && rows.length > 0){
		    res.send(rows);
		}
		else
		    console.log('Error while performing Query.');
  	});
});

app.put("/api/users/:id",function(req, res){
	var put = {
		username : req.body.username,
		password : req.body.password,
		email    : req.body.email
	};
	connection.query("UPDATE user set ? where id = ?", [put, req.params.id], function(err) {
		if (!err){
		    res.send('ok');
		}
		else
		    console.log('Error while performing Query.');
  	});
});

app.listen(3000);