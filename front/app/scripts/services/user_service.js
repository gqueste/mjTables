angular.module('mjTables').

    factory('UserAPI', ['Restangular', 'ConnexionService', function(Restangular, ConnexionService){

        var createUserCode = "secretCodeForUserCreation";

        var service = Restangular.service('users');

        return {
            getAll: getAll,
            login: login,
            findByUsername: findByUsername,
            findByMail: findByMail,
            createUser : createUser,
            getUser : getUser
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

        function login(user){
            var serv = Restangular.service('users/login');
            return serv
                .post(user)
                .then(function(data){
                    ConnexionService.setToken(data.token);
                    return true;
                });
        }

        function findByUsername(username){
            return service
                .getList({username : username})
                .then(function(data){
                    return data;
                })
                .catch(function(error){
                    throw error;
                });
        }

        function findByMail(mail){
            return service
                .getList({mail : mail})
                .then(function(data){
                    return data;
                })
                .catch(function(error){
                    throw error;
                });
        }

        function createUser(user){
            user.code = createUserCode;
            return service
                .post(user)
                .then(function(data){
                    return data;
                })
                .catch(function(error){
                    throw error;
                });
        }

        function getUser(id){
            return service
                .one(id)
                .then(function(data){
                    return data;
                })
                .catch(function(error){
                    throw error;
                });
        }

    }]);