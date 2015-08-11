module.exports = {
    findUserById : function(connection, id, callback){
        connection.query('SELECT * from users where id = ?', [id] , function(err, rows) {
            if (!err){
                callback(rows)
            }
            else{
                err.error = true;
                callback(err);
            }
        });
    },
    getAllUsers : function(connection, callback){
        connection.query('SELECT * from users', function(err, rows) {
            if (!err){
                callback(rows);
            }
            else{
                err.error = true;
                callback(err);
            }
        });
    },
    insertUser : function(connection, user, callback){
        connection.query("INSERT INTO users SET ?", [user], function(err, result){
            if(!err)
                callback(result.insertId);
            else{
                err.error = true;
                callback(err);
            }
        });
    },
    updateUser : function(connection, user, id, callback){
        connection.query("UPDATE users set ? where id = ?", [user, id], function(err) {
            if (!err){
                user.id = id;
                callback(user);
            }
            else{
                err.error = true;
                callback(err);
            }
        });
    },
    findByUsername : function(connection, username, callback) {
        connection.query("Select * from users where username = ?", [username], function(err, rows) {
            if(!err){
                callback(rows);
            }
            else{
                err.error = true;
                callback(err);
            }
        })
    },
    findByMail : function(connection, mail, callback){
        connection.query("Select * from users where email = ?", [mail], function(err, rows) {
            if(!err){
                callback(rows);
            }
            else{
                err.error = true;
                callback(err);
            }
        })
    }
};