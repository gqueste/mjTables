var database   = require("./database");
module.exports = {
    findGameById : function(id, callback){
        var connection = database.connection();
        connection.query('SELECT * from games where id = ?', [id] , function(err, rows) {
            connection.destroy();
            if (!err){
                callback(rows)
            }
            else{
                err.error = true;
                callback(err);
            }
        });
    },
    getAllGames : function(callback){
        var connection = database.connection();
        connection.query('SELECT * from games', function(err, rows) {
            connection.destroy();
            if (!err){
                callback(rows);
            }
            else{
                err.error = true;
                callback(err);
            }
        });
    },
    insertGame : function(game, callback){
        var connection = database.connection();
        connection.query("INSERT INTO games SET ?", [game], function(err, result){
            connection.destroy();
            if(!err)
                callback(result.insertId);
            else{
                err.error = true;
                callback(err);
            }
        });
    },
    updateGame : function(game, id, callback){
        var connection = database.connection();
        connection.query("UPDATE games set ? where id = ?", [game, id], function(err) {
            connection.destroy();
            if (!err){
                game.id = id;
                callback(game);
            }
            else{
                err.error = true;
                callback(err);
            }
        });
    }
};