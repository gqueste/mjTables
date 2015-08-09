angular.module('mjTables').

    controller('TableOverviewCtrl', ['$scope', '$rootScope', 'UserAPI', 'TableAPI', 'ConnexionService', '$state', '$stateParams', function($scope, $rootScope, UserAPI, TableAPI, ConnexionService, $state, $stateParams){

        $scope.table = {};
        $scope.message = '';
        $scope.loaded = false;

        init();

        function init(message){
            $scope.loaded = false;
            $scope.message = message;
            TableAPI.getTable($stateParams.id).then(function(table){
                $scope.table = table;
                $scope.loaded = true;
            }).catch(function(error){
                console.log(error);
            })
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
            $state.go('tablesOverview');
        });
    }]);