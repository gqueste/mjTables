module.exports = {
    findFrequencesById : function(connection, id, callback){
        connection.query('SELECT * from frequences where id = ?', [id] , function(err, rows) {
            if (!err){
                callback(rows)
            }
            else{
                err.error = true;
                callback(err);
            }
        });
    },
    getAllFrequences : function(connection, callback){
        connection.query('SELECT * from frequences', function(err, rows) {
            if (!err){
                callback(rows);
            }
            else{
                err.error = true;
                callback(err);
            }
        });
    }
};