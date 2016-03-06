angular.module('mjTables').

    controller('GameCtrl', ['$scope', 'GameAPI', 'TableAPI', '$state', '$modal', '$q', function($scope, GameAPI, TableAPI, $state, $modal, $q){

        $scope.game = {};
        $scope.tables = [];
        $scope.messageSuccess = '';

        init();

        function init(message){
            $scope.tables = [];
            $scope.messageSuccess = message;
            GameAPI.getGame($scope.gameid).then(function(game){
                $scope.game = game;
            }).catch(function(error){
                console.log(error);
            });

            TableAPI.findTablesForGame($scope.gameid).then(function(tables){
                return $q.all(tables.map(function(table){
                    return TableAPI.getTable(table.id);
                }));
            })
            .then(function(tables){
                $scope.tables = tables;
            })
            .catch(function(error){
                console.log(error);
            });
        }


        $scope.openEditModal = function(){
            var modalInstance = $modal.open({
                templateUrl: 'scripts/components/game/modal/editGameModal.html',
                controller: 'editGameModalCtrl',
                size: 'lg',
                resolve:{
                    idGame: function () {
                        return $scope.game.id;
                    }
                }
            });

            modalInstance.result.then(function(game){
                var message = 'Jeu <strong>' + game.nom + '</strong> a été mis à jour';
                init(message);
            });
        }
    }]);
