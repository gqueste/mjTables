angular.module('mjTables').

    factory('ConnexionService', ['$cookies', function($cookies){
        var token = undefined;
        var cookiesName = 'mjTablesUserToken';

        return{
            estConnecte : estConnecte,
            getToken : getToken,
            setToken : setToken,
            logOut : logOut
        };

        function estConnecte(){
            return getToken() !== undefined;
        }

        function getToken(){
            if(!token){
                if($cookies.get(cookiesName)){
                    token = $cookies.get(cookiesName);
                }
            }
            return token;
        }

        function setToken(tok){
            token = tok;
            $cookies.put(cookiesName, tok);
        }

        function logOut(){
            token = undefined;
            $cookies.remove(cookiesName);
        }
    }]);