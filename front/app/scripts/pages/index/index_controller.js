angular.module('mjTables').

    controller('IndexCtrl', ['$scope', 'User', function($scope, User){
        /*User.getAll()
            .then(function(data){
                console.log(data);
            })
            .catch(function(error){
                console.log(error);
            });*/

        $scope.connecter = function(username, password){
            console.log(username);
            console.log(password);
        };

    }]);