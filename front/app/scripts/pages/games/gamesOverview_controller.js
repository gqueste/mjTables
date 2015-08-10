angular.module('mjTables').

    controller('GamesOverviewCtrl', ['$scope', 'GameAPI', 'ConnexionService', '$modal', function($scope, GameAPI, ConnexionService, $modal){

        $scope.games = [];
        $scope.message = '';

        init();

        function init(message){
            $scope.message = message;
            GameAPI.getAll()
                .then(function(games){
                    $scope.games = games;
                })
                .catch(function(error){
                    console.log(error);
                });
        }

        $scope.openCreateGameModal = function(){
            var modalInstance = $modal.open({
                templateUrl: 'scripts/components/game/modal/editGameModal.html',
                controller: 'editGameModalCtrl',
                size: 'lg',
                resolve:{
                    idGame: function () {
                        return -1;
                    }
                }
            });

            modalInstance.result.then(function(game){
                var message = 'Jeu <strong>' + game.nom + '</strong> a été créé';
                init(message);
            });
        }
    }]);