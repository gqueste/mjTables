angular.module('mjTables').

    factory('FrequenceAPI', ['Restangular', function(Restangular){

        var service = Restangular.service('frequences');

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