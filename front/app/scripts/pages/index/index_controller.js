angular.module('mjTables').

    controller('IndexCtrl', ['$scope', 'UserAPI', '$state', function($scope, UserAPI, $state){

        $scope.connecter = function(username, password){
            var user = {
                username: username,
                password: password
            };

            UserAPI.login(user).then(function(success){
                if(success){
                    $state.go('tablesOverview');
                }
            }).catch(function(error){
               $scope.messageError = error.data;
            });
        };

    }]);