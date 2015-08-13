angular.module('mjTables').

    factory('TableAPI', ['Restangular', 'ConnexionService', function(Restangular, ConnexionService){

        var service = Restangular.service('tables');

        return {
            getTable: getTable,
            findTablesForMJ: findTablesForMJ,
            findTablesForPlayer: findTablesForPlayer,
            findTablesForGame: findTablesForGame,
            findOtherTablesForPlayer: findOtherTablesForPlayer,
            updateTable : updateTable,
            deleteTable : deleteTable,
            createTable : createTable,
            getPlayersForTable : getPlayersForTable,
            addPlayerToTable : addPlayerToTable,
            removePlayerFromTable : removePlayerFromTable,
            sendMail : sendMail,
            findAll : findAll
        };

        function getTable(id){
            return Restangular
                .one('tables',id)
                .get()
                .then(function(data){
                    return data;
                })
                .catch(function(error){
                    throw error;
                });
        }

        function findTablesForMJ(id){
            return service
                .getList({mj : id})
                .then(function(data){
                    return data;
                })
                .catch(function(error){
                    throw error;
                });
        }

        function findTablesForPlayer(id){
            return service
                .getList({player : id})
                .then(function(data){
                    return data;
                })
                .catch(function(error){
                    throw error;
                });
        }

        function findTablesForGame(id){
            return service
                .getList({game : id})
                .then(function(data){
                    return data;
                })
                .catch(function(error){
                    throw error;
                });
        }

        function findOtherTablesForPlayer(id){
            return service
                .getList({player : id, others:true})
                .then(function(data){
                    return data;
                })
                .catch(function(error){
                    throw error;
                });
        }

        function updateTable(table) {
            table.token = ConnexionService.getToken();
            return Restangular
                .one('tables', table.id)
                .customPUT(table)
                .then(function(data) {
                    return data;
                })
                .catch(function (error) {
                    throw error;
                });
        }

        function deleteTable(table_id){
            return Restangular
                .one('tables', table_id)
                .all('delete')
                .post({token: ConnexionService.getToken()})
                .then(function(data) {
                    return data;
                })
                .catch(function (error) {
                    throw error;
                });
        }

        function createTable(table){
            table.token = ConnexionService.getToken();
            return service
                .post(table)
                .then(function(data){
                    return data;
                })
                .catch(function(error){
                    throw error;
                });
        }

        function getPlayersForTable(id){
            return Restangular
                .one('tables',id)
                .all('players')
                .getList()
                .then(function(data){
                    return data;
                })
                .catch(function(error){
                    throw error;
                });
        }

        function addPlayerToTable(table_id, user_id){
            return Restangular
                .one('tables',table_id)
                .all('players')
                .post({id: user_id, token: ConnexionService.getToken()})
                .then(function(data){
                    return data;
                })
                .catch(function(error){
                    throw error;
                });
        }

        function removePlayerFromTable(table_id, user_id){
            return Restangular
                .one('tables',table_id)
                .one('players',user_id)
                .all('remove')
                .post({token: ConnexionService.getToken()})
                .then(function(data){
                    return data;
                })
                .catch(function(error){
                    throw error;
                });
        }

        function sendMail(mail, table_id){
            var token = ConnexionService.getToken();
            return Restangular
                .one('tables', table_id)
                .all('players')
                .all('mail')
                .post({mail : mail, token:token})
                .then(function(data){
                    return data;
                })
                .catch(function(error){
                    throw error;
                });
        }

        function findAll(nom, mj, game, frequences, statuts){
            var query = {};
            if(nom && nom != ''){
                query.nom = nom;
            }
            if(mj){
                query.mj = mj.id;
            }
            if(game && game != -1){
                query.game = game;
            }
            if(statuts != ''){
                query.statuts = statuts;
            }
            if(frequences != ''){
                query.frequences = frequences;
            }
            return service
                .getList(query)
                .then(function(data){
                    return data;
                })
                .catch(function(error){
                    throw error;
                });
        }


    }]);