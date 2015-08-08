angular.module('mjTables').

    factory('StatusAPI', ['Restangular', function(Restangular){

        var service = Restangular.service('status');

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