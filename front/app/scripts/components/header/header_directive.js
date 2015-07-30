angular.module('mjTables').

    directive('mjtablesHeader', function(){
        return {
            restrict: 'E',
            templateUrl: 'scripts/components/header/header.html',
            controller: 'HeaderCtrl'
        };
    });