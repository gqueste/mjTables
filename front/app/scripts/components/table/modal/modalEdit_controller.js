angular.module('mjTables').

    controller('modalEditCtrl', ['$scope', 'TableAPI', 'GameAPI', 'StatusAPI', 'FrequenceAPI', 'idTable', function($scope, TableAPI, GameAPI, StatusAPI, FrequenceAPI, idTable){
        $scope.table = {};
        $scope.games = [];
        $scope.status = [];
        $scope.frequences = [];
        $scope.newGame = {};
        $scope.addGameAction = false;

        init();

        function init(){
            $scope.addGameAction = false;
        }

        TableAPI.getTable(idTable).then(function(table){
            $scope.table = table;
        }).catch(function(error){
            console.log(error);
        });

        GameAPI.getAll().then(function(games){
            $scope.games = games;
        }).catch(function(error){
            console.log(error);
        });

        StatusAPI.getAll().then(function(status){
            $scope.status = status;
        }).catch(function(error){
            console.log(error);
        });

        FrequenceAPI.getAll().then(function(frequences){
            $scope.frequences = frequences;
        }).catch(function(error){
            console.log(error);
        });

        $scope.toogleGameAction = function(){
            $scope.addGameAction = !$scope.addGameAction;
        };

        $scope.addGame = function(){
            //TODO
        }



    }]);