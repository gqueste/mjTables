module.exports = {
    findStatusById : function(connection, id, callback){
        connection.query('SELECT * from status where id = ?', [id] , function(err, rows) {
            if (!err){
                callback(rows)
            }
            else{
                err.error = true;
                callback(err);
            }
        });
    },
    getAllStatus : function(connection, callback){
        connection.query('SELECT * from status', function(err, rows) {
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