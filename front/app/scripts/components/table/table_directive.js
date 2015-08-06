angular.module('mjTables').

    directive('mjtablesTable', function(){
        return {
            restrict: 'E',
            templateUrl: 'scripts/components/table/table.html',
            controller: 'TableCtrl',
            scope: {
                table_id: '='
            }
        };
    });