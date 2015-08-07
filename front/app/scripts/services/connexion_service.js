angular.module('mjTables').

    factory('ConnexionService', ['$cookies', function($cookies){
        var token = undefined;
        var cookiesName = 'mjTablesUserToken';
        var cookiesNameID = 'mjTablesUserId';
        var user_id = undefined;

        return{
            estConnecte : estConnecte,
            getToken : getToken,
            setToken : setToken,
            logOut : logOut,
            setCurrentUserId : setCurrentUserId,
            getCurrentUserId : getCurrentUserId
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

        function setCurrentUserId(id){
            user_id = id;
            $cookies.put(cookiesNameID, id);
        }

        function getCurrentUserId(){
            if(!user_id){
                user_id = $cookies.get(cookiesNameID);
            }
            return user_id;
        }
    }]);