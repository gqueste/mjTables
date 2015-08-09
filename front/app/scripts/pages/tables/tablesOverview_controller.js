angular.module('mjTables').

    controller('TablesOverviewCtrl', ['$scope', 'UserAPI', 'TableAPI', 'ConnexionService', function($scope, UserAPI, TableAPI, ConnexionService){

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
                })
                .catch(function(error){
                    console.log(error);
                });
            TableAPI.findTablesForPlayer(ConnexionService.getCurrentUserId())
                .then(function(tables){
                    $scope.tablesForPlayer = tables;
                })
                .catch(function(error){
                    console.log(error);
                });
            TableAPI.findOtherTablesForPlayer(ConnexionService.getCurrentUserId())
                .then(function(tables){
                    $scope.otherTables = tables;
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
        })
    }]);