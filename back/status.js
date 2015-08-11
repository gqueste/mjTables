var database   = require("./database");
module.exports = {
    findStatusById : function(id, callback){
        var connection = database.connection();
        connection.query('SELECT * from status where id = ?', [id] , function(err, rows) {
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
    getAllStatus : function(callback){
        var connection = database.connection();
        connection.query('SELECT * from status', function(err, rows) {
            if (!err){
                callback(rows);
            }
            else{
                err.error = true;
                callback(err);
            }
            connection.destroy();
        });
    }
};