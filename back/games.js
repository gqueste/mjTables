module.exports = {
    findGameById : function(connection, id, callback){
        connection.query('SELECT * from games where id = ?', [id] , function(err, rows) {
            if (!err){
                callback(rows)
            }
            else{
                err.error = true;
                callback(err);
            }
        });
    },
    getAllGames : function(connection, callback){
        connection.query('SELECT * from games', function(err, rows) {
            if (!err){
                callback(rows);
            }
            else{
                err.error = true;
                callback(err);
            }
        });
    },
    insertGame : function(connection, game, callback){
        connection.query("INSERT INTO games SET ?", [game], function(err, result){
            if(!err)
                callback(result.insertId);
            else{
                err.error = true;
                callback(err);
            }
        });
    },
    updateGame : function(connection, game, id, callback){
        connection.query("UPDATE games set ? where id = ?", [game, id], function(err) {
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