var express    = require("express");
var bodyParser = require('body-parser');
var app        = express();
var database   = require("./database");
var connection = database.connection();
var morgan     = require('morgan');
var jwt    	   = require('jsonwebtoken');
var Users 	   = require("./users");
var SHA256 	   = require("crypto-js/sha256");
var createUserCode = "secretCodeForUserCreation";

var secret = 'mjTablesVerySecretChuttt';

app.set('superSecret', secret);
app.use(morgan('dev'));

connection.connect(function(err){
	if(!err) {
		console.log("Database is connected ... \n\n");  
	} else {
	    console.log("Error connecting database ... \n\n");  
	}
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var allowCrossDomain = function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

	// intercept OPTIONS method
	if ('OPTIONS' == req.method) {
		res.send(200);
	}
	else {
		next();
	}
};

app.use(allowCrossDomain);

app.get("/api/v1", function(req, res){
	res.send('mjTables API is running');
});

app.get("/api/v1/users",function(req,res){
	Users.getAllUsers(connection, function(users){
		if(!users.error){
			res.status(200).send(users);
		}
		else
			res.status(500).send(users);
	});
});

app.post("/api/v1/users",function(req,res){
	var user = {
		username : req.body.username,
		password : SHA256(req.body.password),
		email    : req.body.email
	};
	var code = req.body.code;
	if(code === createUserCode){
		Users.insertUser(connection, user, function(id){
			if(!id.error)
				res.status(201).send({id: id});
			else
				res.status(500).send(id);
		});
	}
	else{
		res.sendStatus(401);
	}
});

app.get("/api/v1/users/:id",function(req,res){
	Users.findUserById(connection, req.params.id, function(user){
		if(!user.error){
			if(user.length > 0)
				res.status(200).send(user);
			else
				res.status(404).send(user);
		}
		else{
			res.status(500).send(user);
		}
	});
});

app.put("/api/v1/users/:id",function(req, res){
	var user = {
		username : req.body.username,
		password : SHA256(req.body.password),
		email    : req.body.email
	};

	checkToken(req, function(result){
		if(!result.error){
			Users.findUserById(connection, req.params.id, function(result){
				if(!result.error){
					if(result.length > 0){
						Users.updateUser(connection, user, req.params.id, function(updatedUser){
							if(!updatedUser.error){
								res.sendStatus(200);
							}
							else{
								res.status(500).send(updatedUser);
							}
						});
					}
					else{
						res.status(404).send(result);
					}
				}
				else {
					res.status(500).send(result);
				}
			});
		}
		else{
			res.status(403).send(result);
		}
	});
});


app.post('/api/v1/users/login',	function(req, res) {
	Users.findByUsername(connection, req.body.username, function(user){
		if(!user.error){
			if(user.length > 0){
				user = user[0];
				if(user.password != SHA256(req.body.password)){
					res.status(401).send({message: "Password incorrect"});
				}
				else{
					var token = jwt.sign(user, app.get('superSecret'), {
						expiresInMinutes: 1440 // expires in 24 hours
					});
					res.status(200).send({token: token});
				}
			}
			else{
				res.status(404).send({message : 'No user by this username'});
			}
		}
		else{
			res.status(500).send(user);
		}
	});
});



var checkToken = function(req, callback){
	// check header or url parameters or post parameters for token
	var token = req.body.token || req.query.token || req.headers['x-access-token'];

	// decode token
	if (token) {
		// verifies secret and checks exp
		jwt.verify(token, app.get('superSecret'), function(err) {
			if (err) {
				callback({error: 'Failed to authenticate token.' });
			} else {
				callback({ok: true});
			}
		});
	} else {
		// if there is no token
		// return an error
		callback({error: 'No token provided.'});
	}
};



app.listen(3000);