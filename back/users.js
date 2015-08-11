var database   = require("./database");
module.exports = {
    findUserById : function(id, callback){
        var connection = database.connection();
        connection.query('SELECT * from users where id = ?', [id] , function(err, rows) {
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
    getAllUsers : function(callback){
        var connection = database.connection();
        connection.query('SELECT * from users', function(err, rows) {
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
    insertUser : function(user, callback){
        var connection = database.connection();
        connection.query("INSERT INTO users SET ?", [user], function(err, result){
            connection.destroy();
            if(!err)
                callback(result.insertId);
            else{
                err.error = true;
                callback(err);
            }
        });
    },
    updateUser : function(user, id, callback){
        var connection = database.connection();
        connection.query("UPDATE users set ? where id = ?", [user, id], function(err) {
            connection.destroy();
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
    findByUsername : function(username, callback) {
        var connection = database.connection();
        connection.query("Select * from users where username = ?", [username], function(err, rows) {
            connection.destroy();
            if(!err){
                callback(rows);
            }
            else{
                err.error = true;
                callback(err);
            }
        })
    },
    findByMail : function(mail, callback){
        var connection = database.connection();
        connection.query("Select * from users where email = ?", [mail], function(err, rows) {
            connection.destroy();
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