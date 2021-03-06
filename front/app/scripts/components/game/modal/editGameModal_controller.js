angular.module('mjTables').

    controller('editGameModalCtrl', ['$scope', '$rootScope', '$modalInstance', 'idGame', 'GameAPI', 'TextAngularService', function($scope, $rootScope, $modalInstance, idGame, GameAPI, TextAngularService){

        $scope.game = {};
        $scope.game.id = idGame;
        $scope.textAngular = TextAngularService;

        if(!$scope.isCreation){
            GameAPI.getGame(idGame).then(function(game){
                $scope.game = game;
            }).catch(function(error){
                console.log(error);
            });
        }

        $scope.ok = function () {
            if($scope.isCreation()){
                GameAPI.createGame($scope.game).then(function(){
                    $modalInstance.close($scope.game);
                }).catch(function(error){
                    console.log(error);
                })
            }
            else{
                GameAPI.updateGame($scope.game).then(function(){
                    $modalInstance.close($scope.game);
                }).catch(function(error){
                    console.log(error);
                });
            }
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.isCreation = function(){
            return idGame == -1;
        }
    }]);