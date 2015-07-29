angular.module('mjTables').

    factory('ConnexionService', [function(){
        var token = undefined;

        return{
            estConnecte : estConnecte,
            getToken : getToken,
            setToken : setToken
        };

        function estConnecte(){
            return getToken() !== undefined;
        }

        function getToken(){
            return token;
        }

        function setToken(tok){
            token = tok;
        }
    }]);