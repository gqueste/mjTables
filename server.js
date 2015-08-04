var express    = require("express");
var bodyParser = require('body-parser');
var app        = express();
var database   = require("./back/database");
var connection = database.connection();
var morgan     = require('morgan');
var jwt    	   = require('jsonwebtoken');
var Users 	   = require("./back/users");
var SHA256 	   = require("crypto-js/sha256");
var createUserCode = "secretCodeForUserCreation";

var secret = 'mjTablesVerySecretChuttt';

app.set('superSecret', secret);
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.sendStatus(200);
    }
    else {
        next();
    }
};
app.use(allowCrossDomain);
connection.connect(function(err){
    if(!err) {
        console.log("Database is connected ... \n\n");
    } else {
        console.log("Error connecting database ... \n\n");
    }
});




app.set('port', 9000);
app.set('views', __dirname + '/front/app/views');
app.set('view engine', 'jade');

app.use(express.static(__dirname + '/front/app'));
app.use('/node_modules', express.static(__dirname + '/node_modules')); //add this so the browser can GET the node_modules files

app.get('/', function(req, res){
    res.render('home.jade');
}); // load the single view file (angular will handle the page changes on the front-end)

app.get('/partials/:name', function (req, res) {
    var name = req.params.name;
    res.render('partials/' + name);
});


app.get("/api/v1", function(req, res){
    res.send('mjTables API is running');
});

app.get("/api/v1/users",function(req,res){
    var sendUsers = function(users){
        if(!users.error){
            res.status(200).send(users);
        }
        else
            res.status(500).send(users);
    };

    if(req.query.username){
        Users.findByUsername(connection, req.query.username, sendUsers);
    }
    else if(req.query.mail){
        Users.findByMail(connection, req.query.mail, sendUsers);
    }
    else{
        Users.getAllUsers(connection, sendUsers);
    }
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
            Users.findUserById(connection, req.params.id, function(userFound){
                if(!userFound.error){
                    if(userFound.length > 0){
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
                        res.status(404).send('No user by this username');
                    }
                }
                else {
                    res.status(500).send(userFound);
                }
            });
        }
        else{
            res.status(403).send(result.error);
        }
    });
});


app.post('/api/v1/users/login',	function(req, res) {
    Users.findByUsername(connection, req.body.username, function(user){
        if(!user.error){
            if(user.length > 0){
                user = user[0];
                if(user.password != SHA256(req.body.password)){
                    res.status(401).send("Password incorrect");
                }
                else{
                    var token = jwt.sign(user, app.get('superSecret'), {
                        expiresInMinutes: 1440 // expires in 24 hours
                    });
                    res.status(200).send({token: token});
                }
            }
            else{
                res.status(404).send('No user by this username');
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


app.get('*', function(req, res){
    res.render('home.jade');
});

var server = app.listen(app.get('port'), function() {
    console.log('Listening on port %d', server.address().port);
});