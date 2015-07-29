angular.module('mjTables').

    controller('IndexCtrl', ['$scope', 'UserAPI', function($scope, UserAPI){

        $scope.connecter = function(username, password){
            var user = {
                username: username,
                password: password
            };

            UserAPI.login(user).then(function(success){
                if(success){
                    console.log("connecte");
                }
            }).catch(function(error){
               console.log(error.data);
            });
        };

    }]);