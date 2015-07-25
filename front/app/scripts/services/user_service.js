angular.module('mjTables').

    factory('User', ['Restangular', function(Restangular){

        var service = Restangular.service('users');

        return {
            getAll: getAll,
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