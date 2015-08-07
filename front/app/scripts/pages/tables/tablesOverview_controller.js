angular.module('mjTables').

    controller('TablesOverviewCtrl', ['$scope', 'UserAPI', 'TableAPI', 'ConnexionService', function($scope, UserAPI, TableAPI, ConnexionService){

        $scope.tablesForMJ = [];
        $scope.tablesForPlayer = [];
        $scope.otherTables = [];

        init();

        function init(){
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
    }]);