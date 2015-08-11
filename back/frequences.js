var database   = require("./database");
module.exports = {
    findFrequencesById : function(id, callback){
        var connection = database.connection();
        connection.query('SELECT * from frequences where id = ?', [id] , function(err, rows) {
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
    getAllFrequences : function(callback){
        var connection = database.connection();
        connection.query('SELECT * from frequences', function(err, rows) {
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