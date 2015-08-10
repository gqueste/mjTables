angular.module('mjTables').

    controller('editGameModalCtrl', ['$scope', '$modalInstance', 'idGame', 'GameAPI', function($scope, $modalInstance, idGame, GameAPI){

        $scope.game = {};

        GameAPI.getGame(idGame).then(function(game){
            $scope.game = game;
        }).catch(function(error){
            console.log(error);
        });

        $scope.ok = function () {
            GameAPI.updateGame($scope.game).then(function(){
                $modalInstance.close($scope.game);
            }).catch(function(error){
                console.log(error);
            });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }]);