angular.module('mjTables').

    controller('GameCtrl', ['$scope', 'GameAPI', 'TableAPI', '$state', '$modal', function($scope, GameAPI, TableAPI, $state, $modal){

        $scope.game = {};
        $scope.tables = [];
        $scope.messageSuccess = '';

        init();

        function init(message){
            $scope.messageSuccess = message;
            GameAPI.getGame($scope.gameid).then(function(game){
                $scope.game = game;
            }).catch(function(error){
                console.log(error);
            });

            TableAPI.findTablesForGame($scope.gameid).then(function(tables){
                $scope.tables = [];
                for(var i = 0; i < tables.length; i++){
                    TableAPI.getTable(tables[i].id).then(function(table){
                        $scope.tables.push(table);
                    }).catch(function(error){
                        console.log(error);
                    })
                }
            }).catch(function(error){
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

            modalInstance.result.then(function(updatedGame){
                var message = 'Jeu <strong>' + updatedGame.nom + '</strong> a été mis à jour';
                init(message);
            });
        }
    }]);