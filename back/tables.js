module.exports = {
    findTableById : function(connection, id, callback){
        var req = 'select tables.id as table_id, ';
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
        });
    },
    getAllTables : function(connection, callback){
        connection.query('select id from tables', function(err, rows) {
            if (!err){
                callback(rows);
            }
            else{
                err.error = true;
                callback(err);
            }
        });
    },
    insertTable : function(connection, table, callback){
        connection.query("INSERT INTO tables SET ?", [user], function(err, result){
            if(!err)
                callback(result.insertId);
            else{
                err.error = true;
                callback(err);
            }
        });
    },
    updateTable : function(connection, table, id, callback){
        connection.query("UPDATE tables set ? where id = ?", [table, id], function(err) {
            if (!err){
                table.id = id;
                callback(table);
            }
            else{
                err.error = true;
                callback(err);
            }
        });
    },
    findPlayersForTable : function(connection, id, callback) {
        connection.query('select user_id from users_tables where users_tables.table_id = ?', [id], function(err, rows) {
            if(!err){
                callback(rows);
            }
            else{
                err.error = true;
                callback(err);
            }
        })
    },
    findTablesForMJ : function(connection, id, callback) {
        var req = 'select id from tables where mj = ? ';
        connection.query(req, [id], function(err, rows) {
            if(!err){
                callback(rows);
            }
            else{
                err.error = true;
                callback(err);
            }
        })
    },
    findTablesForPlayer : function(connection, id, callback) {
        connection.query('select table_id from users_tables where users_tables.user_id = ?', [id], function(err, rows) {
            if(!err){
                callback(rows);
            }
            else{
                err.error = true;
                callback(err);
            }
        })
    },
    findTablesForGame : function(connection, id, callback) {
        connection.query('select id from tables where game = ?', [id], function(err, rows) {
            if(!err){
                callback(rows);
            }
            else{
                err.error = true;
                callback(err);
            }
        })
    },
    addPlayerToTable : function(connection, user_id, table_id, callback){
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
        });
    },
    removePlayerFromTable : function(connection, user_id, table_id, callback){
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
        })
    },
    deleteTable : function(connection, table_id, callback){
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
        });
    }
};