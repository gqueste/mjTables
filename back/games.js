var database   = require("./database");
module.exports = {
    findGameById : function(id, callback){
        var connection = database.connection();
        connection.query('SELECT * from games where id = ?', [id] , function(err, rows) {
            if (!err){
                callback(rows)
            }
            else{
                err.error = true;
                callback(err);
            }
            connection.destroy();
        });
    },
    getAllGames : function(callback){
        var connection = database.connection();
        connection.query('SELECT * from games', function(err, rows) {
            if (!err){
                callback(rows);
            }
            else{
                err.error = true;
                callback(err);
            }
            connection.destroy();
        });
    },
    insertGame : function(game, callback){
        var connection = database.connection();
        connection.query("INSERT INTO games SET ?", [game], function(err, result){
            if(!err)
                callback(result.insertId);
            else{
                err.error = true;
                callback(err);
            }
            connection.destroy();
        });
    },
    updateGame : function(game, id, callback){
        var connection = database.connection();
        connection.query("UPDATE games set ? where id = ?", [game, id], function(err) {
            if (!err){
                game.id = id;
                callback(game);
            }
            else{
                err.error = true;
                callback(err);
            }
            connection.destroy();
        });
    }
};