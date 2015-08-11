var database   = require("./database");
module.exports = {
    findStatusById : function(id, callback){
        var connection = database.connection();
        connection.query('SELECT * from status where id = ?', [id] , function(err, rows) {
            connection.end(function(){
                if (!err){
                    callback(rows)
                }
                else{
                    err.error = true;
                    callback(err);
                }
            });
        });
    },
    getAllStatus : function(callback){
        var connection = database.connection();
        connection.query('SELECT * from status', function(err, rows) {
            connection.end(function(){
                if (!err){
                    callback(rows)
                }
                else{
                    err.error = true;
                    callback(err);
                }
            });
        });
    }
};