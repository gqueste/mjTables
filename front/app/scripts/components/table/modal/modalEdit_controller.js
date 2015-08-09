angular.module('mjTables').

    controller('modalEditCtrl', ['$scope', '$modalInstance', 'TableAPI', 'GameAPI', 'StatusAPI', 'FrequenceAPI', 'idTable', function($scope, $modalInstance, TableAPI, GameAPI, StatusAPI, FrequenceAPI, idTable){
        $scope.table = {};
        $scope.games = [];
        $scope.status = [];
        $scope.frequences = [];
        $scope.newGame = {};
        $scope.addGameAction = false;

        init();

        function init(){
            $scope.addGameAction = false;
            loadGames();
        }

        TableAPI.getTable(idTable).then(function(table){
            $scope.table = table;
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
            GameAPI.createGame($scope.newGame).then(function(){
                loadGames();
                $scope.addGameSuccess = 'Jeu <strong>' + $scope.newGame.nom + '</strong> créé.';
                $scope.toogleGameAction();
            }).catch(function(error){
                console.log(error);
            })
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.ok = function () {
            var updatedTable = {
                id: idTable,
                nom: $scope.table.table_nom,
                mj: $scope.table.mj_id,
                game: $scope.table.game_id,
                status: $scope.table.status_id,
                description: $scope.table.description,
                frequence: $scope.table.frequence_id,
                nbJoueurs: $scope.table.nbJoueurs,
                nbJoueursTotal: $scope.table.nbJoueursTotal
            };
            TableAPI.updateTable(updatedTable).then(function(){
                $modalInstance.close(updatedTable);
            }).catch(function(error){
                console.log(error);
            })
        };

        function loadGames(){
            GameAPI.getAll().then(function(games){
                $scope.games = games;
            }).catch(function(error){
                console.log(error);
            });
        }



    }]);