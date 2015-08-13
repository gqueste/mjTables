module.exports = {
    findTableById : function(connection, id, callback){
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
        });
    },
    getAllTables : function(connection, nom, mj, game, statuts, frequences, callback){
        var req = 'select id from tables ';
        var search = '';
        if(nom || mj || game || statuts.length > 0 || frequences.length > 0){
            search = 'where ';
            if(nom){
                if(search != 'where '){
                    search += ' and ';
                }
                nom = '%'+nom+'%';
                search += "tables.nom like " + connection.escape(nom);
            }
            if(mj){
                if(search != 'where '){
                    search += ' and ';
                }
                search += 'tables.mj = ' + connection.escape(mj);
            }
            if(game){
                if(search != 'where '){
                    search += ' and ';
                }
                search += 'tables.game = ' + connection.escape(game);
            }
            if(statuts.length > 0){
                if(search != 'where '){
                    search += ' and ';
                }
                search += '(';
                search += 'tables.status = ' + connection.escape(statuts[0]);
                if(statuts.length > 1){
                    for(var i = 1; i < statuts.length; i++){
                        search += ' or tables.status = ' + connection.escape(statuts[i]);
                    }
                }
                search += ')';
            }
            if(frequences.length > 0){
                if(search != 'where '){
                    search += ' and ';
                }
                search += '(';
                search += 'tables.frequence = ' + connection.escape(frequences[0]);
                if(frequences.length > 1){
                    for(var i = 1; i < frequences.length; i++){
                        search += ' or tables.frequence = ' + connection.escape(frequences[i]);
                    }
                }
                search += ')';
            }
        }
        req = req + search;
        connection.query(req, function(err, rows) {
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
        connection.query("INSERT INTO tables SET ?", [table], function(err, result){
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
        connection.query('select table_id as id from users_tables where users_tables.user_id = ?', [id], function(err, rows) {
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
    findOtherTables : function(connection, id, callback) {
        var req = 'select distinct tables.id from tables ';
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