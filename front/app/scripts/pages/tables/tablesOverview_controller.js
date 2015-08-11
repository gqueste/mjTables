angular.module('mjTables').

    controller('TablesOverviewCtrl', ['$scope', 'UserAPI', 'TableAPI', 'ConnexionService', '$modal', function($scope, UserAPI, TableAPI, ConnexionService, $modal){

        $scope.tablesForMJ = [];
        $scope.tablesForPlayer = [];
        $scope.otherTables = [];
        $scope.message = '';

        init();

        function init(message){
            $scope.message = message;
            TableAPI.findTablesForMJ(ConnexionService.getCurrentUserId())
                .then(function(tables){
                    $scope.tablesForMJ = tables;
                    TableAPI.findTablesForPlayer(ConnexionService.getCurrentUserId())
                        .then(function(tables){
                            $scope.tablesForPlayer = tables;
                            TableAPI.findOtherTablesForPlayer(ConnexionService.getCurrentUserId())
                                .then(function(tables){
                                    $scope.otherTables = tables;
                                })
                                .catch(function(error){
                                    console.log(error);
                                });
                        })
                        .catch(function(error){
                            console.log(error);
                        });
                })
                .catch(function(error){
                    console.log(error);
                });
        }

        $scope.$on('playerRemoved', function(event, args){
            TableAPI.getTable(args.table_id).then(function(table){
                UserAPI.getUser(args.user_id).then(function(user){
                    var message = 'Le joueur <strong>' + user.username + '</strong> a bien été retiré de la table <strong>' + table.table_nom + '</strong>.';
                    init(message);
                })
            }).catch(function(error){
                console.log(error);
            });
        });

        $scope.$on('playerAdded', function(event, args){
            TableAPI.getTable(args.table_id).then(function(table){
                UserAPI.getUser(args.user_id).then(function(user){
                    var message = 'Le joueur <strong>' + user.username + '</strong> a bien été ajouté à la table <strong>' + table.table_nom + '</strong>.';
                    init(message);
                })
            }).catch(function(error){
                console.log(error);
            });
        });

        $scope.$on('tableDeleted', function(event, args){
            var message = 'La table <strong>' + args.table_nom + '</strong> a bien été supprimée.';
            init(message);
        });

        $scope.openCreateTableModal = function(){
            var modalInstance = $modal.open({
                templateUrl: 'scripts/components/table/modal/editTableModal.html',
                controller: 'editTableModalCtrl',
                size: 'lg',
                resolve:{
                    idTable: function () {
                        return -1;
                    }
                }
            });

            modalInstance.result.then(function(updatedTable){
                var message = 'Table <strong>' + updatedTable.nom + '</strong> a été créée';
                init(message);
            });
        }
    }]);