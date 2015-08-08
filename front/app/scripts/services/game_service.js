angular.module('mjTables').

    factory('GameAPI', ['Restangular', function(Restangular){

        var service = Restangular.service('games');

        return {
            getAll: getAll
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
    }]);