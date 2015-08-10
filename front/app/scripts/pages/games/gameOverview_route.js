angular.module('mjTables').

    config(function($stateProvider){
        $stateProvider
            .state('game', {
                url: "/games/:id",
                templateUrl: 'partials/game.jade',
                controller: 'GameOverviewCtrl',
                onEnter: ['$state', '$stateParams', '$timeout', 'ConnexionService', function($state, $stateParams, $timeout, ConnexionService){
                    if(!ConnexionService.estConnecte()){
                        $timeout(function(){
                            $state.go('index');
                        }, 10);
                    }
                    else{
                        if(!$stateParams.id){
                            $timeout(function(){
                                $state.go('gamesOverview');
                            }, 10);
                        }
                    }
                }]
            })
    });