angular.module('mjTables').

    controller('TableCtrl', ['$scope', '$rootScope', 'TableAPI', 'UserAPI', 'ConnexionService', '$modal', function($scope, $rootScope, TableAPI, UserAPI, ConnexionService, $modal){

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
                            $scope.players = [];
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

            modalInstance.result.then(function(updatedTable){
                var message = 'Table <strong>' + updatedTable.nom + '</strong> a été mise à jour';
                init(null, message);
            });
        };

        $scope.removePlayer = function(user_id){
            TableAPI.removePlayerFromTable($scope.tableid, user_id).then(function(){
                $rootScope.$broadcast('playerRemoved', {table_id : $scope.tableid, user_id : user_id});
            }).catch(function(error){
                console.log(error);
            });
        };

        $scope.rejoindreTable = function(){
            TableAPI.addPlayerToTable($scope.tableid, ConnexionService.getCurrentUserId()).then(function(){
                $rootScope.$broadcast('playerAdded', {table_id : $scope.tableid, user_id : ConnexionService.getCurrentUserId()});
            }).catch(function(error){
                console.log(error);
            });
        };

        $scope.openModalDelete = function() {
            var modalInstance = $modal.open({
                templateUrl: 'scripts/components/table/modal/modalDelete.html',
                controller: 'modalDeleteCtrl',
                size: 'sm',
                resolve:{
                    idTable: function () {
                        return $scope.tableid;
                    },
                    nomTable: function() {
                        return $scope.table.table_nom;
                    }
                }
            });

            modalInstance.result.then(function(){
                $rootScope.$broadcast('tableDeleted', {table_nom : $scope.table.table_nom});
            });
        };
    }]);