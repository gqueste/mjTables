angular.module('mjTables').

    controller('GameCtrl', ['$scope', 'GameAPI', 'TableAPI', '$state', '$stateParams', function($scope, GameAPI, TableAPI, $state, $stateParams){

        $scope.game = {};
        $scope.tables = [];

        GameAPI.getGame($stateParams.id).then(function(game){
            $scope.game = game;
        }).catch(function(error){
            console.log(error);
        });

        TableAPI.findTablesForGame($stateParams.id).then(function(tables){
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
    }]);