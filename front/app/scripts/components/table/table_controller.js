angular.module('mjTables').

    controller('TableCtrl', ['$scope', 'TableAPI', 'UserAPI', 'ConnexionService', '$modal', function($scope, TableAPI, UserAPI, ConnexionService, $modal){

        $scope.table = {};
        $scope.players = [];
        $scope.messageErreur = '';
        $scope.messageSuccess = '';
        $scope.ConnexionService = ConnexionService;

        init();

        function init(messageErreur, messageSuccess){
            $scope.messageErreur = messageErreur;
            $scope.messageSuccess = messageSuccess;
            TableAPI.getTable($scope.tableid)
                .then(function(table){
                    $scope.table = table;
                    TableAPI.getPlayersForTable($scope.tableid)
                        .then(function(players_ids){
                            for(var i = 0; i < players_ids.length; i++){
                                UserAPI.getUser(players_ids[i].user_id)
                                    .then(function(user){
                                        $scope.players.push(user);
                                    })
                                    .catch(function(error){
                                        console.log(error);
                                    })
                            }
                        })
                        .catch(function(error){
                            console.log(error);
                        })
                })
                .catch(function(error){
                   console.log(error);
                });
        }

        $scope.isAdmin = function(){
            return $scope.table.mj_id == ConnexionService.getCurrentUserId();
        };

        $scope.isAlreadyPlayer = function(){
            var ret = false;
            for(var i = 0; i < $scope.players.length; i++){
                if($scope.players[i].id == ConnexionService.getCurrentUserId()){
                    ret = true;
                    break;
                }
            }
            return ret;
        };

        $scope.openModalEdit = function(){
            var modalInstance = $modal.open({
                templateUrl: 'scripts/components/table/modal/modalEdit.html',
                controller: 'modalEditCtrl',
                size: 'lg',
                resolve:{
                    idTable: function () {
                        return $scope.tableid;
                    }
                }
            });

            modalInstance.result.then(function(){

            })
        }

    }]);