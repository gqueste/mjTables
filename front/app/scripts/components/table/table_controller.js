angular.module('mjTables').

    controller('TableCtrl', ['$scope', 'TableAPI', 'UserAPI', 'ConnexionService', function($scope, TableAPI, UserAPI, ConnexionService){

        $scope.table = {};
        $scope.players = [];
        $scope.ConnexionService = ConnexionService;

        init();

        function init(){
            TableAPI.getTable($scope.table_id)
                .then(function(table){
                    $scope.table = table;
                    TableAPI.getPlayersForTable($scope.table_id)
                        .then(function(players_ids){
                            for(var i = 0; i < players_ids.length; i++){
                                UserAPI.getUser(players_ids[i].user_id)
                                    .then(function(user){
                                        $scope.players.push(user);
                                    })
                                    .catch(function(error){
                                        console.log(error);
                                    })
                            }
                        })
                        .catch(function(error){
                            console.log(error);
                        })
                })
                .catch(function(error){
                   console.log(error);
                });
        }

        $scope.isAdmin = function(){
            return $scope.table.mj_id === ConnexionService.getCurrentUserId();
        };

        $scope.isAlreadyPlayer = function(){
            var ret = false;
            for(var i = 0; i < players.length; i++){
                if(players[i].id === ConnexionService.getCurrentUserId()){
                    ret = true;
                    break;
                }
            }
            return ret;
        };

    }]);