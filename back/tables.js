var req_info = 'select tables.id as table_id, users.id as mj_id, users.username as mj_username, games.id as game_id, games.nom as game_nom, status.id as status_id, status.libelle as status_libelle, tables.description, frequences.id as frequence_id, frequences.libelle as frequence_libelle, tables.nbJoueurs, tables.nbJoueursTotal ';
var target = 'from tables join users on tables.mj = users.id join games on tables.game = games.id join status on tables.status = status.id join frequences on tables.frequence = frequences.id ';
var req_header = req_info + target;
module.exports = {
    findTableById : function(connection, id, callback){
        var req = req_header + 'where tables.id = ? ';
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
        connection.query(req_header, function(err, rows) {
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
        var req = 'select users.id as user_id, users.username, users.email from users_tables ';
        req += 'join users on users.id = users_tables.user_id ';
        req += 'where users_tables.table_id = ?';
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
    findTablesForMJ : function(connection, id, callback) {
        var req = req_header + 'where mj_id = ? ';
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
        var req = req_header;
        req += 'join users_tables on users_tables.table_id = tables.id ';
        req += 'where users_tables.user_id = ? ';
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
    addPlayerToTable : function(connection, user_id, table_id, callback){
        var user_table = {
            user_id : user_id,
            table_id : table_id
        };
        connection.query('INSERT INTO users_tables set ?',[user_table], function(err){
            if (!err){
                callback();
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
                callback();
            }
            else{
                err.error = true;
                callback(err);
            }
        })
    }
};