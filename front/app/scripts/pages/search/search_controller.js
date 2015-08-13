angular.module('mjTables').

    controller('SearchCtrl', ['$scope', 'UserAPI', 'TableAPI', 'StatusAPI', 'FrequenceAPI', 'GameAPI', function($scope, UserAPI, TableAPI, StatusAPI, FrequenceAPI, GameAPI){

        $scope.resultats = undefined;
        $scope.status = [];
        $scope.frequences = [];
        $scope.filtres = {};
        $scope.filtres.game = -1;
        $scope.games = [];
        $scope.users = [];

        init();

        function init(){
            StatusAPI.getAll().then(function(status){
                $scope.status = status;
                FrequenceAPI.getAll().then(function(frequences){
                    $scope.frequences = frequences;
                    GameAPI.getAll().then(function(games){
                        games.push({id:-1, nom:''});
                        $scope.games = games;
                        UserAPI.getAll().then(function(users){
                            $scope.users = users;
                        }).catch(console)
                    }).catch(function(error){
                        console.log(error);
                    })
                }).catch(function(error){
                    console.log(error);
                })
            }).catch(function(error){
                console.log(error);
            })
        }

        $scope.search = function(){
            $scope.resultats = [];

            if(!isMJProblem()){
                var idsStatuts = getIdsFromModel($scope.status);
                var idsFrequences = getIdsFromModel($scope.frequences);
                var listeFormateeStatuts = formateListe(idsStatuts);
                var listeFormateeFrequences = formateListe(idsFrequences);
                TableAPI.findAll($scope.filtres.nom, $scope.filtres.mj, $scope.filtres.game, listeFormateeFrequences, listeFormateeStatuts).then(function(tables){
                    for(var i = 0; i < tables.length; i++){
                        TableAPI.getTable(tables[i].id).then(function(table){
                            $scope.resultats.push(table);
                        }).catch(function(error){
                            console.log(error);
                        })
                    }
                }).catch(function(error){
                    console.log(error);
                });
            }
        };

        function getIdsFromModel(liste){
            var ret = [];
            for(var i = 0; i < liste.length; i++){
                if(liste[i].checked){
                    ret.push(liste[i].id);
                }
            }
            return ret;
        }

        function formateListe(liste){
            var ret = '';
            if(liste.length > 0){
                ret += liste[0].toString();
            }
            if(liste.length > 1){
                for(var i = 1; i < liste.length; i++){
                    ret += '|'+liste[i].toString();
                }
            }
            return ret;
        }

        function isMJProblem(){
            return $scope.filtres.mj && !$scope.filtres.mj.id;
        }

        $scope.reset = function(){
            $scope.filtres = {};
            $scope.filtres.game = -1;
            resetListes($scope.status);
            resetListes($scope.frequences);
        };

        function resetListes(liste){
            for(var i = 0; i < liste.length; i++){
                liste[i].checked = false;
            }
        }

    }]);