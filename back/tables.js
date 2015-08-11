var database   = require("./database");
module.exports = {
    findTableById : function(id, callback){
        var connection = database.connection();
        var req = 'select tables.id as table_id, ';
        req += 'tables.nom as table_nom, ';
        req += 'users.id as mj_id, ';
        req += 'users.username as mj_username, ';
        req += 'games.id as game_id, ';
        req += 'games.nom as game_nom, ';
        req += 'status.id as status_id, ';
        req += 'status.libelle as status_libelle, ';
        req += 'tables.description, ';
        req += 'frequences.id as frequence_id, ';
        req += 'frequences.libelle as frequence_libelle, ';
        req += 'tables.nbJoueurs, ';
        req += 'tables.nbJoueursTotal ';
        req += 'from tables ';
        req += 'join users on tables.mj = users.id ';
        req += 'join games on tables.game = games.id ';
        req += 'join status on tables.status = status.id ';
        req += 'join frequences on tables.frequence = frequences.id ';
        req += 'where tables.id = ? ';
        connection.query(req, [id] , function(err, rows) {
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
    getAllTables : function(callback){
        var connection = database.connection();
        connection.query('select id from tables', function(err, rows) {
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
    insertTable : function(table, callback){
        var connection = database.connection();
        connection.query("INSERT INTO tables SET ?", [table], function(err, result){
            if(!err)
                callback(result.insertId);
            else{
                err.error = true;
                callback(err);
            }
            connection.destroy();
        });
    },
    updateTable : function(table, id, callback){
        var connection = database.connection();
        connection.query("UPDATE tables set ? where id = ?", [table, id], function(err) {
            if (!err){
                table.id = id;
                callback(table);
            }
            else{
                err.error = true;
                callback(err);
            }
            connection.destroy();
        });
    },
    findPlayersForTable : function(id, callback) {
        var connection = database.connection();
        connection.query('select user_id from users_tables where users_tables.table_id = ?', [id], function(err, rows) {
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
    findTablesForMJ : function(id, callback) {
        var connection = database.connection();
        var req = 'select id from tables where mj = ? ';
        connection.query(req, [id], function(err, rows) {
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
    findTablesForPlayer : function(id, callback) {
        var connection = database.connection();
        connection.query('select table_id as id from users_tables where users_tables.user_id = ?', [id], function(err, rows) {
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
    findTablesForGame : function(id, callback) {
        var connection = database.connection();
        connection.query('select id from tables where game = ?', [id], function(err, rows) {
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
    findOtherTables : function(id, callback) {
        var connection = database.connection();
        var req = 'select tables.id from tables ';
        req += 'left join users_tables on users_tables.table_id = tables.id ';
        req += 'where tables.mj <> ? ';
        req += 'and tables.id NOT IN ( ';
        req += '    select tables.id from tables ';
        req += '    left join users_tables on users_tables.table_id = tables.id ';
        req += '    where user_id = ? ';
        req += ');';
        connection.query(req, [id, id], function(err, rows) {
            if(!err) {
                callback(rows);
            }
            else {
                err.error = true;
                callback(err);
            }
            connection.destroy();
        })
    },
    addPlayerToTable : function(user_id, table_id, callback){
        var connection = database.connection();
        var user_table = {
            user_id : user_id,
            table_id : table_id
        };
        connection.query('INSERT INTO users_tables set ?',[user_table], function(err){
            if (!err){
                connection.query('update tables set nbJoueurs = nbJoueurs+1 where id = ?', [table_id], function(err2){
                    if(!err2){
                        callback();
                    }
                    else{
                        err2.error = true;
                        callback(err2);
                    }
                });
            }
            else{
                err.error = true;
                callback(err);
            }
            connection.destroy();
        });
    },
    removePlayerFromTable : function(user_id, table_id, callback){
        var connection = database.connection();
        connection.query('DELETE from users_tables where user_id = ? and table_id = ?', [user_id, table_id], function(err){
            if(!err){
                connection.query('update tables set nbJoueurs = nbJoueurs-1 where id = ?', [table_id], function(err2){
                    if(!err2){
                        callback();
                    }
                    else{
                        err2.error = true;
                        callback(err2);
                    }
                });
            }
            else{
                err.error = true;
                callback(err);
            }
            connection.destroy();
        })
    },
    deleteTable : function(table_id, callback){
        var connection = database.connection();
        connection.query('DELETE from users_tables where table_id = ?', [table_id], function(err){
            if(!err){
                connection.query('Delete from tables where id = ?', [table_id], function(err2){
                    if(!err2){
                        callback();
                    }
                    else{
                        err2.error = true;
                        callback(err2);
                    }
                });
            }
            else{
                err.error = true;
                callback(err);
            }
            connection.destroy();
        });
    }
};