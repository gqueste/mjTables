var database   = require("./database");
module.exports = {
    findFrequencesById : function(id, callback){
        var connection = database.connection();
        connection.query('SELECT * from frequences where id = ?', [id] , function(err, rows) {
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
    getAllFrequences : function(callback){
        var connection = database.connection();
        connection.query('SELECT * from frequences', function(err, rows) {
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