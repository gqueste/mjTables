angular.module('mjTables').

    factory('GameAPI', ['Restangular', 'ConnexionService', function(Restangular, ConnexionService){

        var service = Restangular.service('games');

        return {
            getAll: getAll,
            createGame : createGame
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
    }]);