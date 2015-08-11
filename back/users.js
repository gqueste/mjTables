var database   = require("./database");
module.exports = {
    findUserById : function(id, callback){
        var connection = database.connection();
        connection.query('SELECT * from users where id = ?', [id] , function(err, rows) {
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
    getAllUsers : function(callback){
        var connection = database.connection();
        connection.query('SELECT * from users', function(err, rows) {
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
    insertUser : function(user, callback){
        var connection = database.connection();
        connection.query("INSERT INTO users SET ?", [user], function(err, result){
            if(!err)
                callback(result.insertId);
            else{
                err.error = true;
                callback(err);
            }
            connection.destroy();
        });
    },
    updateUser : function(user, id, callback){
        var connection = database.connection();
        connection.query("UPDATE users set ? where id = ?", [user, id], function(err) {
            if (!err){
                user.id = id;
                callback(user);
            }
            else{
                err.error = true;
                callback(err);
            }
            connection.destroy();
        });
    },
    findByUsername : function(username, callback) {
        var connection = database.connection();
        connection.query("Select * from users where username = ?", [username], function(err, rows) {
            if(!err){
                callback(rows);
            }
            else{
                err.error = true;
                callback(err);
            }
            connection.destroy();
        })
    },
    findByMail : function(mail, callback){
        var connection = database.connection();
        connection.query("Select * from users where email = ?", [mail], function(err, rows) {
            if(!err){
                callback(rows);
            }
            else{
                err.error = true;
                callback(err);
            }
            connection.destroy();
        })
    }
};