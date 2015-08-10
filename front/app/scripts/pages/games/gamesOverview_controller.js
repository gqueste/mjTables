angular.module('mjTables').

    controller('GamesOverviewCtrl', ['$scope', 'GameAPI', 'ConnexionService', function($scope, GameAPI, ConnexionService){

        $scope.games = [];
        $scope.message = '';

        init();

        function init(message){
            $scope.message = message;
            GameAPI.getAll()
                .then(function(games){
                    $scope.games = games;
                })
                .catch(function(error){
                    console.log(error);
                });
        }
    }]);