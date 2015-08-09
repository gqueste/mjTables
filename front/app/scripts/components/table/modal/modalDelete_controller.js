angular.module('mjTables').

    controller('modalDeleteCtrl', ['$scope', '$modalInstance', 'nomTable', 'idTable', 'TableAPI', function($scope, $modalInstance, nomTable, idTable, TableAPI){
       $scope.nomTable = nomTable;

        $scope.ok = function () {
            TableAPI.deleteTable(idTable).then(function(){
                $modalInstance.close();
            }).catch(function(error){
                console.log(error);
            })
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }]);