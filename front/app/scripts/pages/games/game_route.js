angular.module('mjTables').

    config(function($stateProvider){
        $stateProvider
            .state('game', {
                url: "/games/:id",
                templateUrl: 'partials/game.jade',
                controller: 'GameCtrl',
                onEnter: ['$state', '$stateParams', '$timeout', 'ConnexionService', function($state, $stateParams, $timeout, ConnexionService){
                    if(!ConnexionService.estConnecte() || !$stateParams.id){
                        $timeout(function(){
                            $state.go('index');
                        }, 10);
                    }
                }]
            })
    });