var express    = require("express");
var bodyParser = require('body-parser');
var app        = express();
var morgan     = require('morgan');
var jwt    	   = require('jsonwebtoken');
var SHA256 	   = require("crypto-js/sha256");
var createUserCode = "secretCodeForUserCreation";
var secret = 'mjTablesVerySecretChuttt';

var Users 	   = require("./back/users");
var Tables     = require('./back/tables');
var Frequences = require('./back/frequences');
var Games      = require('./back/games');
var Status     = require('./back/status');
var Mails      = require('./back/mails');


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


app.set('port', process.env.PORT || 9000);
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


/**** USERS ****/
app.get("/api/v1/users",function(req,res){
    var sendUsers = function(users){
        if(!users.error){
            res.status(200).send(users);
        }
        else
            res.status(500).send(users);
    };

    if(req.query.username){
        Users.findByUsername(req.query.username, sendUsers);
    }
    else if(req.query.mail){
        Users.findByMail(req.query.mail, sendUsers);
    }
    else{
        Users.getAllUsers(sendUsers);
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
        Users.insertUser(user, function(id){
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
    Users.findUserById(req.params.id, function(user){
        if(!user.error){
            if(user.length > 0)
                res.status(200).send(user[0]);
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
        email    : req.body.email
    };
    var newPassword = req.body.newPassword;
    var oldPassword = req.body.oldPassword;
    var errorPassword = false;

        checkToken(req, function(result){
        if(!result.error){
            Users.findUserById(req.params.id, function(userFound){
                if(!userFound.error){
                    if(userFound.length > 0){
                        if(newPassword){
                            if(SHA256(oldPassword) != userFound[0].password){
                                errorPassword = true;
                            }
                            else{
                                user.password = SHA256(newPassword);
                            }
                        }
                        if(!errorPassword){
                            Users.updateUser(user, req.params.id, function(updatedUser){
                                if(!updatedUser.error){
                                    res.sendStatus(200);
                                }
                                else{
                                    res.status(500).send(updatedUser);
                                }
                            });
                        }
                        else{
                            res.status(401).send("Le mot de passe ne correspond pas a l'ancien.");
                        }

                    }
                    else{
                        res.status(404).send('No user by this id');
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
    Users.findByUsername(req.body.username, function(user){
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
                    res.status(200).send({
                        token: token,
                        id: user.id
                    });
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

app.post('/api/v1/users/:id/mail',	function(req, res) {
    checkToken(req, function(result){
        if(!result.error){
            Users.findUserById(req.params.id, function(user){
                if(!user.error){
                    Mails.sendMail(req.body.mail, function(error){
                        if(!error){
                            res.sendStatus(200);
                        }
                        else{
                            res.status(500).send(error);
                        }
                    });
                }
                else{
                    res.status(500).send(user);
                }
            });
        }
        else{
            res.status(403).send(result.error);
        }
    });
});


/**** TABLES ****/

app.get('/api/v1/tables', function(req, res){
    var sendTables = function(tables){
        if(!tables.error){
            res.status(200).send(tables);
        }
        else
            res.status(500).send(tables);
    };

    if(req.query.mj){
        Tables.findTablesForMJ(req.query.mj, sendTables);
    }
    else if(req.query.player){
        if(req.query.others){
            Tables.findOtherTables(req.query.player, sendTables);
        }
        else{
            Tables.findTablesForPlayer(req.query.player, sendTables);
        }
    }
    else if(req.query.game){
        Tables.findTablesForGame(req.query.game, sendTables);
    }
    else {
        Tables.getAllTables(sendTables);
    }
});


app.post('/api/v1/tables', function(req, res){
    var table = {
        mj: req.body.mj,
        nom : req.body.nom,
        game: req.body.game,
        status: req.body.status,
        description: req.body.description,
        frequence: req.body.frequence,
        nbJoueurs: req.body.nbJoueurs,
        nbJoueursTotal: req.body.nbJoueursTotal
    };
    checkToken(req, function(result){
        if(!result.error){
            Tables.insertTable(table, function(id){
                if(!id.error)
                    res.status(201).send({id: id});
                else
                    res.status(500).send(id);
            });
        }
        else{
            res.status(403).send(result.error);
        }
    });
});


app.get('/api/v1/tables/:id', function(req,res){
    Tables.findTableById(req.params.id, function(table){
        if(!table.error){
            if(table.length > 0)
                res.status(200).send(table[0]);
            else
                res.status(404).send(table);
        }
        else{
            res.status(500).send(table);
        }
    });
});

app.post('/api/v1/tables/:id/delete', function(req,res){
    checkToken(req, function(result){
        if(!result.error){
            Tables.findTableById(req.params.id, function(table){
                if(!table.error){
                    if(table.length > 0){
                        Tables.deleteTable(req.params.id, function(err){
                            if(!err){
                                res.sendStatus(200);
                            }
                            else{
                                res.status(500).send(err);
                            }
                        });
                    }
                    else
                        res.status(404).send(table);
                }
                else{
                    res.status(500).send(table);
                }
            });
        }
        else{
            res.status(403).send(result.error);
        }
    });
});


app.put('/api/v1/tables/:id', function(req,res){
    var table = {
        mj: req.body.mj,
        nom : req.body.nom,
        game: req.body.game,
        status: req.body.status,
        description: req.body.description,
        frequence: req.body.frequence,
        nbJoueurs: req.body.nbJoueurs,
        nbJoueursTotal: req.body.nbJoueursTotal
    };
    checkToken(req, function(result){
        if(!result.error){
            Tables.findTableById(req.params.id, function(tableFound){
                if(!tableFound.error){
                    if(tableFound.length > 0){
                        Tables.updateTable(table, req.params.id, function(updatedTable){
                            if(!updatedTable.error){
                                res.sendStatus(200);
                            }
                            else{
                                res.status(500).send(updatedTable);
                            }
                        });
                    }
                    else{
                        res.status(404).send('No table by this id');
                    }
                }
                else {
                    res.status(500).send(tableFound);
                }
            });
        }
        else{
            res.status(403).send(result.error);
        }
    });
});

app.get('/api/v1/tables/:id/players', function(req, res){
    Tables.findTableById(req.params.id, function(table){
        if(!table.error){
            if(table.length > 0){
                Tables.findPlayersForTable(req.params.id, function(players){
                    if(!players.error){
                        res.status(200).send(players);
                    }
                    else{
                        res.status(500).send(players);
                    }
                });
            }
            else
                res.status(404).send(table);
        }
        else{
            res.status(500).send(table);
        }
    });
});

app.post('/api/v1/tables/:id/players', function(req, res){
    var user_id = req.body.id;
    var table_id = req.params.id;
    checkToken(req, function(result){
        if(!result.error){
            Tables.findTableById(table_id, function(table){
                if(!table.error){
                    if(table.length > 0){
                        Users.findUserById(user_id, function(user){
                            if(!user.error){
                                if(user.length > 0){
                                    Tables.addPlayerToTable(user_id, table_id, function(err){
                                        if(!err){
                                            res.sendStatus(200);
                                        }
                                        else{
                                            res.status(500).send(err);
                                        }
                                    });
                                }
                                else
                                    res.status(404).send(user);
                            }
                            else{
                                res.status(500).send(user);
                            }
                        });
                    }
                    else
                        res.status(404).send(table);
                }
                else{
                    res.status(500).send(table);
                }
            });
        }
        else{
            res.status(403).send(result.error);
        }
    });
});

app.post('/api/v1/tables/:idTable/players/:idUser/remove', function(req, res){
    checkToken(req, function(result){
       if(!result.error){
           Tables.findTableById(req.params.idTable, function(table){
               if(!table.error){
                   if(table.length > 0){
                       Users.findUserById(req.params.idUser, function(user){
                           if(!user.error){
                               if(user.length > 0){
                                   Tables.removePlayerFromTable(req.params.idUser, req.params.idTable, function(err){
                                       if(!err){
                                           res.sendStatus(200);
                                       }
                                       else{
                                           res.status(500).send(err);
                                       }
                                   });
                               }
                               else
                                   res.status(404).send(user);
                           }
                           else{
                               res.status(500).send(user);
                           }
                       });
                   }
                   else
                       res.status(404).send(table);
               }
               else{
                   res.status(500).send(table);
               }
           });
       }
        else{
           res.status(403).send(result.error);
       }
    });
});

app.post('/api/v1/tables/:idTable/players/mail', function(req, res) {
    checkToken(req, function(result){
        if(!result.error){
            Tables.findTableById(req.params.idTable, function(table) {
                if (!table.error) {
                    if (table.length > 0) {
                        Mails.sendMail(req.body.mail, function(err){
                            if(!err){
                                res.sendStatus(200);
                            }
                            else{
                                res.status(500).send(err);
                            }
                        });
                    }
                }
                else{
                    res.status(404).send(table.error);
                }
            });
        }
        else{
            res.status(403).send(result.error);
        }
    });
});


/**** FREQUENCES ****/
app.get('/api/v1/frequences', function(req, res){
    Frequences.getAllFrequences(function(freqs){
        if(!freqs.error){
            res.status(200).send(freqs);
        }
        else{
            res.status(500).send(freqs);
        }
    });
});

app.get('/api/v1/frequences/:id', function(req, res){
    Frequences.findFrequencesById(req.params.id, function(freq){
        if(!freq.error){
            if(freq.length > 0){
                res.status(200).send(freq);
            }
            else{
                res.status(404).send(freq);
            }
        }
        else{
            res.status(500).send(freq);
        }
    })
});


/**** STATUS ****/
app.get('/api/v1/status', function(req, res){
    Status.getAllStatus(function(status){
        if(!status.error){
            res.status(200).send(status);
        }
        else{
            res.status(500).send(status);
        }
    });
});

app.get('/api/v1/status/:id', function(req, res){
    Status.findStatusById(req.params.id, function(status){
        if(!status.error){
            if(status.length > 0){
                res.status(200).send(status);
            }
            else{
                res.status(404).send(status);
            }
        }
        else{
            res.status(500).send(status);
        }
    })
});


/**** GAMES ****/
app.get('/api/v1/games', function(req, res){
    Games.getAllGames(function(games){
        if(!games.error){
            res.status(200).send(games);
        }
        else{
            res.status(500).send(games);
        }
    });
});

app.get('/api/v1/games/:id', function(req, res){
    Games.findGameById(req.params.id, function(games){
        if(!games.error){
            if(games.length > 0){
                res.status(200).send(games[0]);
            }
            else{
                res.status(404).send(games);
            }
        }
        else{
            res.status(500).send(games);
        }
    });
});

app.put('/api/v1/games/:id', function(req, res){
    var game = {
        nom: req.body.nom,
        description: req.body.description
    };
    checkToken(req, function(result){
        if(!result.error){
            Games.findGameById(req.params.id, function(gameFound){
                if(!gameFound.error){
                    if(gameFound.length > 0){
                        Games.updateGame(game, req.params.id, function(updatedGame){
                            if(!updatedGame.error){
                                res.sendStatus(200);
                            }
                            else{
                                res.status(500).send(updatedGame);
                            }
                        });
                    }
                    else{
                        res.status(404).send('No game by this id');
                    }
                }
                else{
                    res.status(500).send(gameFound);
                }
            });
        }
        else{
            res.status(403).send(result.error);
        }
    });
});

app.post('/api/v1/games', function(req, res){
    var game = {
        nom: req.body.nom,
        description: req.body.description
    };
    checkToken(req, function(result){
        if(!result.error){
            Games.insertGame(game, function(id){
                if(!id.error)
                    res.status(201).send({id: id});
                else
                    res.status(500).send(id);
            })
        }
        else{
            res.status(403).send(result.error);
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