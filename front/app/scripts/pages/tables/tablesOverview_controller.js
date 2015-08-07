angular.module('mjTables').

    controller('TablesOverviewCtrl', ['$scope', 'UserAPI', 'TableAPI', 'ConnexionService', function($scope, UserAPI, TableAPI, ConnexionService){

        $scope.tablesForMJ = [];

        init();

        function init(){
            TableAPI.findTableForMJ(ConnexionService.getCurrentUserId())
                .then(function(tables){
                    $scope.tablesForMJ = tables;
                })
                .catch(function(error){
                    console.log(error);
                });
        }
    }]);