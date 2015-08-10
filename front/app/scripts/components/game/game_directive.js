angular.module('mjTables').

    directive('mjtablesGame', function(){
        return {
            restrict: 'E',
            templateUrl: 'scripts/components/game/game.html',
            controller: 'GameCtrl',
            scope: {
                gameid: '='
            }
        };
    });