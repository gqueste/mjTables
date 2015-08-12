angular.module('mjTables').

    controller('editTableModalCtrl', ['$scope', '$modalInstance', 'TableAPI', 'GameAPI', 'StatusAPI', 'FrequenceAPI', 'idTable', 'ConnexionService', 'UserAPI', 'TextAngularService', function($scope, $modalInstance, TableAPI, GameAPI, StatusAPI, FrequenceAPI, idTable, ConnexionService, UserAPI, TextAngularService){
        $scope.table = {};
        $scope.games = [];
        $scope.status = [];
        $scope.frequences = [];
        $scope.newGame = {};
        $scope.addGameAction = false;
        $scope.textAngular = TextAngularService;

        $scope.isCreation = function(){
            return idTable == -1;
        };

        init();

        function init(){
            $scope.addGameAction = false;
            loadGames();
        }

        if(!$scope.isCreation()){
            TableAPI.getTable(idTable).then(function(table){
                $scope.table = table;
            }).catch(function(error){
                console.log(error);
            });
        }
        else{
            $scope.table.mj_id = ConnexionService.getCurrentUserId();
            UserAPI.getUser($scope.table.mj_id).then(function(user){
                $scope.table.mj_username = user.username;
            }).catch(function(error){
                console.log(error);
            });
        }


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
                nom: $scope.table.table_nom,
                mj: $scope.table.mj_id,
                game: $scope.table.game_id,
                status: $scope.table.status_id,
                description: $scope.table.description,
                frequence: $scope.table.frequence_id,
                nbJoueurs: $scope.table.nbJoueurs,
                nbJoueursTotal: $scope.table.nbJoueursTotal
            };
            if($scope.isCreation()){
                updatedTable.nbJoueurs = 0;
                TableAPI.createTable(updatedTable).then(function(){
                    $modalInstance.close(updatedTable);
                }).catch(function(error){
                    console.log(error);
                });
            }
            else {
                updatedTable.id = idTable;
                TableAPI.updateTable(updatedTable).then(function(){
                    $modalInstance.close(updatedTable);
                }).catch(function(error){
                    console.log(error);
                });
            }
        };

        function loadGames(){
            GameAPI.getAll().then(function(games){
                $scope.games = games;
            }).catch(function(error){
                console.log(error);
            });
        }



    }]);