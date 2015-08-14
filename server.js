var express    = require("express");
var bodyParser = require('body-parser');
var app        = express();
var database   = require("./back/database");
var connection = {};
var connected = false;


var reconnect = function(){
    if(!connected){
        connection = database.connection();
        connection.on('error', function(err){
            console.log(err.code);
            connection.destroy();
            connected = false;
        });
        connected = true;
    }
};

var morgan     = require('morgan');
var jwt    	   = require('jsonwebtoken');
var SHA256 	   = require("crypto-js/sha256");
var createUserCode = process.env.USERCREATION_CODE;
var secret = process.env.WEBTOKEN_SECRET;

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
    reconnect();
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
    reconnect();
    var user = {
        username : req.body.username,
        password : SHA256(req.body.password),
        email    : req.body.email
    };
    var code = req.body.code;
    if(code === createUserCode){
        insertUser();
    }
    else{
        res.sendStatus(401);
    }

    function insertUser(){
        Users.insertUser(connection, user, handleInsertionUser);
    }

    function handleInsertionUser(id){
        if(!id.error)
            res.status(201).send({id: id});
        else
            res.status(500).send(id);
    }
});

app.get("/api/v1/users/:id",function(req,res){
    reconnect();
    Users.findUserById(connection, req.params.id, handleFindUser);

    function handleFindUser(user){
        if(!user.error){
            if(user.length > 0)
                res.status(200).send(user[0]);
            else
                res.status(404).send(user);
        }
        else{
            res.status(500).send(user);
        }
    }
});

app.put("/api/v1/users/:id",function(req, res){
    reconnect();
    var user = {
        username : req.body.username,
        email    : req.body.email
    };
    var newPassword = req.body.newPassword;
    var oldPassword = req.body.oldPassword;
    var errorPassword = false;

    checkToken(req, handleAuth);

    function handleAuth(result){
        if(!result.error){
            findUser();
        }
        else{
            res.status(403).send(result.error);
        }
    }

    function findUser(){
        Users.findUserById(connection, req.params.id, handleFindUser);
    }

    function handleFindUser(userFound){
        if(!userFound.error){
            if(userFound.length > 0){
                checkPassword(userFound[0]);
            }
            else{
                res.status(404).send('No user by this id');
            }
        }
        else {
            res.status(500).send(userFound);
        }
    }

    function checkPassword(userFound){
        if(newPassword){
            if(SHA256(oldPassword) != userFound.password){
                errorPassword = true;
            }
            else{
                user.password = SHA256(newPassword);
            }
        }
        if(!errorPassword){
           updateUser();
        }
        else{
            res.status(401).send("Le mot de passe ne correspond pas a l'ancien.");
        }
    }

    function updateUser(){
        Users.updateUser(connection, user, req.params.id, handleUpdateUser);
    }

    function handleUpdateUser(updatedUser){
        if(!updatedUser.error){
            res.sendStatus(200);
        }
        else{
            res.status(500).send(updatedUser);
        }
    }
});


app.post('/api/v1/users/login',	function(req, res) {
    reconnect();
    Users.findByUsername(connection, req.body.username, handleFindUser);

    function handleFindUser(user){
        if(!user.error){
            if(user.length > 0){
                user = user[0];
                checkPassword(user);
            }
            else{
                res.status(404).send('No user by this username');
            }
        }
        else{
            res.status(500).send(user);
        }
    }

    function checkPassword(user){
        if(user.password != SHA256(req.body.password)){
            res.status(401).send("Password incorrect");
        }
        else{
            giveToken(user);
        }
    }

    function giveToken(user){
        var token = jwt.sign(user, app.get('superSecret'), {
            expiresInMinutes: 1440 // expires in 24 hours
        });
        res.status(200).send({
            token: token,
            id: user.id
        });
    }
});

app.post('/api/v1/users/:id/mail',	function(req, res) {
    reconnect();
    checkToken(req, handleAuth);

    function handleAuth(result){
        if(!result.error){
            findUser();
        }
        else{
            res.status(403).send(result.error);
        }
    }

    function findUser(){
        Users.findUserById(connection,req.params.id, handleFindUser);
    }

    function handleFindUser(user){
        if(!user.error){
            sendMail();
        }
        else{
            res.status(500).send(user);
        }
    }

    function sendMail(){
        Mails.sendMail(req.body.mail, handleSendMail);
    }

    function handleSendMail(){
        if(!error){
            res.sendStatus(200);
        }
        else{
            res.status(500).send(error);
        }
    }
});


/**** TABLES ****/

app.get('/api/v1/tables', function(req, res){
    reconnect();
    var sendTables = function(tables){
        if(!tables.error){
            res.status(200).send(tables);
        }
        else
            res.status(500).send(tables);
    };

    if(req.query.others){
        Tables.findOtherTables(connection, req.query.player, sendTables);
    }
    else if (req.query.player){
        Tables.findTablesForPlayer(connection, req.query.player, sendTables);
    }
    else{
        var frequencesID = [];
        var statusID = [];
        if(req.query.statuts){
            statusID = req.query.statuts.split('|');
        }
        if(req.query.frequences){
            frequencesID = req.query.frequences.split('|');
        }
        Tables.getAllTables(connection, req.query.nom, req.query.mj, req.query.game, statusID, frequencesID, sendTables);
    }
});


app.post('/api/v1/tables', function(req, res){
    reconnect();
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
    checkToken(req, checkAuth);

    function checkAuth(result){
        if(!result.error){
            insertTable();
        }
        else{
            res.status(403).send(result.error);
        }
    }

    function insertTable(){
        Tables.insertTable(connection, table, handleInsertTable);
    }

    function handleInsertTable(id){
        if(!id.error)
            res.status(201).send({id: id});
        else
            res.status(500).send(id);
    }
});


app.get('/api/v1/tables/:id', function(req,res){
    reconnect();
    Tables.findTableById(connection, req.params.id, handleFindTable);

    function handleFindTable(table){
        if(!table.error){
            if(table.length > 0)
                res.status(200).send(table[0]);
            else
                res.status(404).send(table);
        }
        else{
            res.status(500).send(table);
        }
    }
});

app.post('/api/v1/tables/:id/delete', function(req,res){
    reconnect();
    checkToken(req, handleAuth);

    function handleAuth(result){
        if(!result.error){
            findTable();
        }
        else{
            res.status(403).send(result.error);
        }
    }

    function findTable(){
        Tables.findTableById(connection, req.params.id, handleFindTable);
    }

    function handleFindTable(table){
        if(!table.error){
            if(table.length > 0){
                deleteTable();
            }
            else
                res.status(404).send(table);
        }
        else{
            res.status(500).send(table);
        }
    }

    function deleteTable(){
        Tables.deleteTable(connection, req.params.id, handleDeleteTable);
    }

    function handleDeleteTable(err){
        if(!err){
            res.sendStatus(200);
        }
        else{
            res.status(500).send(err);
        }
    }
});


app.put('/api/v1/tables/:id', function(req,res){
    reconnect();
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
    checkToken(req, handleAuth);

    function handleAuth(result){
        if(!result.error){
            findTable();
        }
        else{
            res.status(403).send(result.error);
        }
    }

    function findTable(){
        Tables.findTableById(connection, req.params.id, handleFindTable);
    }

    function handleFindTable(tableFound){
        if(!tableFound.error){
            if(tableFound.length > 0){
                updateTable();
            }
            else{
                res.status(404).send('No table by this id');
            }
        }
        else {
            res.status(500).send(tableFound);
        }
    }

    function updateTable(){
        Tables.updateTable(connection, table, req.params.id, handleUpdateTable);
    }

    function handleUpdateTable(updatedTable){
        if(!updatedTable.error){
            res.sendStatus(200);
        }
        else{
            res.status(500).send(updatedTable);
        }
    }
});

app.get('/api/v1/tables/:id/players', function(req, res){
    reconnect();
    Tables.findTableById(connection, req.params.id, handleFindTable);

    function handleFindTable(table){
        if(!table.error){
            if(table.length > 0){
                findPlayersForTable();
            }
            else
                res.status(404).send(table);
        }
        else{
            res.status(500).send(table);
        }
    }

    function findPlayersForTable(){
        Tables.findPlayersForTable(connection, req.params.id, handleFindPlayersForTable);
    }

    function handleFindPlayersForTable(players){
        if(!players.error){
            res.status(200).send(players);
        }
        else{
            res.status(500).send(players);
        }
    }
});

app.post('/api/v1/tables/:id/players', function(req, res){
    reconnect();
    var user_id = req.body.id;
    var table_id = req.params.id;
    checkToken(req, handleAuth);

    function handleAuth(result){
        if(!result.error){
            findTable();
        }
        else{
            res.status(403).send(result.error);
        }
    }

    function findTable(){
        Tables.findTableById(connection, table_id, handleFindTable);
    }

    function handleFindTable(table){
        if(!table.error){
            if(table.length > 0){
                findUser();
            }
            else
                res.status(404).send(table);
        }
        else{
            res.status(500).send(table);
        }
    }

    function findUser(){
        Users.findUserById(connection, user_id, handleFindUser);
    }

    function handleFindUser(user){
        if(!user.error){
            if(user.length > 0){
                addPlayerToTable();
            }
            else
                res.status(404).send(user);
        }
        else{
            res.status(500).send(user);
        }
    }

    function addPlayerToTable(){
        Tables.addPlayerToTable(connection, user_id, table_id, handleAddPlayerToTable);
    }

    function handleAddPlayerToTable(err){
        if(!err){
            res.sendStatus(200);
        }
        else{
            res.status(500).send(err);
        }
    }


});

app.post('/api/v1/tables/:idTable/players/:idUser/remove', function(req, res){
    reconnect();
    checkToken(req, handleAuth);

    function handleAuth(result){
        if(!result.error){
            findTable();
        }
        else{
            res.status(403).send(result.error);
        }
    }

    function findTable(){
        Tables.findTableById(connection, req.params.idTable, handleFindTable);
    }

    function handleFindTable(table){
        if(!table.error){
            if(table.length > 0){
                findUser();
            }
            else
                res.status(404).send(table);
        }
        else{
            res.status(500).send(table);
        }
    }

    function findUser(){
        Users.findUserById(connection, req.params.idUser, handleFindUser);
    }

    function handleFindUser(user){
        if(!user.error){
            if(user.length > 0){
                removePlayerFromTable();
            }
            else
                res.status(404).send(user);
        }
        else{
            res.status(500).send(user);
        }
    }

    function removePlayerFromTable(){
        Tables.removePlayerFromTable(connection, req.params.idUser, req.params.idTable, handleRemovePlayerFromTable);
    }

    function handleRemovePlayerFromTable(err){
        if(!err){
            res.sendStatus(200);
        }
        else{
            res.status(500).send(err);
        }
    }
});

app.post('/api/v1/tables/:idTable/players/mail', function(req, res) {
    reconnect();
    checkToken(req, handleAuth);

    function handleAuth(result){
        if(!result.error){
            findTable();
        }
        else{
            res.status(403).send(result.error);
        }
    }

    function findTable(){
        Tables.findTableById(connection, req.params.idTable, handleFindTable);
    }

    function handleFindTable(table){
        if (!table.error) {
            if (table.length > 0) {
                sendMail();
            }
        }
        else{
            res.status(404).send(table.error);
        }
    }

    function sendMail(){
        Mails.sendMail(req.body.mail, handleSendMail);
    }

    function handleSendMail(err){
        if(!err){
            res.sendStatus(200);
        }
        else{
            res.status(500).send(err);
        }
    }
});


/**** FREQUENCES ****/
app.get('/api/v1/frequences', function(req, res){
    reconnect();
    Frequences.getAllFrequences(connection, handleGetAllFrequences);

    function handleGetAllFrequences(freqs){
        if(!freqs.error){
            res.status(200).send(freqs);
        }
        else{
            res.status(500).send(freqs);
        }
    }
});

app.get('/api/v1/frequences/:id', function(req, res){
    reconnect();
    Frequences.findFrequencesById(connection, req.params.id, handleFindFrequence);

    function handleFindFrequence(freq){
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
    }
});


/**** STATUS ****/
app.get('/api/v1/status', function(req, res){
    reconnect();
    Status.getAllStatus(connection, handleGetAllStatus);

    function handleGetAllStatus(status){
        if(!status.error){
            res.status(200).send(status);
        }
        else{
            res.status(500).send(status);
        }
    }
});

app.get('/api/v1/status/:id', function(req, res){
    reconnect();
    Status.findStatusById(connection, req.params.id, handleFindStatus);

    function handleFindStatus(status){
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
    }
});


/**** GAMES ****/
app.get('/api/v1/games', function(req, res){
    reconnect();
    Games.getAllGames(connection, handleGetAllGames);

    function handleGetAllGames(games){
        if(!games.error){
            res.status(200).send(games);
        }
        else{
            res.status(500).send(games);
        }
    }
});

app.get('/api/v1/games/:id', function(req, res){
    reconnect();
    Games.findGameById(connection, req.params.id, handleFindGame);

    function handleFindGame(games){
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
    }
});

app.put('/api/v1/games/:id', function(req, res){
    reconnect();
    var game = {
        nom: req.body.nom,
        description: req.body.description
    };
    checkToken(req, handleAuth);

    function handleAuth(result){
        if(!result.error){
            findGame();
        }
        else{
            res.status(403).send(result.error);
        }
    }

    function findGame(){
        Games.findGameById(connection, req.params.id, handleFindGame);
    }

    function handleFindGame(gameFound){
        if(!gameFound.error){
            if(gameFound.length > 0){
                updateGame();
            }
            else{
                res.status(404).send('No game by this id');
            }
        }
        else{
            res.status(500).send(gameFound);
        }
    }

    function updateGame(){
        Games.updateGame(connection, game, req.params.id, handleUpdateGame);
    }

    function handleUpdateGame(updatedGame){
        if(!updatedGame.error){
            res.sendStatus(200);
        }
        else{
            res.status(500).send(updatedGame);
        }
    }
});

app.post('/api/v1/games', function(req, res){
    reconnect();
    var game = {
        nom: req.body.nom,
        description: req.body.description
    };
    checkToken(req, handleAuth);

    function handleAuth(result){
        if(!result.error){
            insertGame();
        }
        else{
            res.status(403).send(result.error);
        }
    }

    function insertGame(){
        Games.insertGame(connection, game, handleInsertGame);
    }

    function handleInsertGame(id){
        if(!id.error)
            res.status(201).send({id: id});
        else
            res.status(500).send(id);
    }
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