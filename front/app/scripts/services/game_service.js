angular.module('mjTables').

    factory('GameAPI', ['Restangular', 'ConnexionService', function(Restangular, ConnexionService){

        var service = Restangular.service('games');

        return {
            getAll: getAll,
            getGame: getGame,
            createGame : createGame,
            updateGame: updateGame
        };

        function getAll(){
            return service
                .getList()
                .then(function(data){
                    return data;
                })
                .catch(function(error){
                    throw error;
                });
        }

        function getGame(id){
            return Restangular
                .one('games', id)
                .get()
                .then(function(data){
                    return data;
                })
                .catch(function(error){
                    throw error;
                });
        }

        function createGame(game){
            game.token = ConnexionService.getToken();
            return service
                .post(game)
                .then(function(data){
                    return data;
                })
                .catch(function(error){
                    throw error;
                });
        }

        function updateGame(game){
            game.token = ConnexionService.getToken();
            return Restangular
                .one('games', game.id)
                .customPUT(game)
                .then(function(data){
                    return data;
                })
                .catch(function(error){
                    throw error;
                });
        }
    }]);