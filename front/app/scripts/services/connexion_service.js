angular.module('mjTables').

    factory('ConnexionService', [function(){
        var token = undefined;

        return{
            estConnecte : estConnecte,
            token : token
        };

        function estConnecte(){
            return token !== undefined;
        }
    }]);