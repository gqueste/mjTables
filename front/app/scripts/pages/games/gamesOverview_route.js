angular.module('mjTables').

    config(function($stateProvider){
        $stateProvider
            .state('gamesOverview', {
                url: "/games",
                templateUrl: 'partials/gamesOverview.jade',
                controller: 'GamesOverviewCtrl',
                onEnter: ['$state', '$timeout', 'ConnexionService', function($state, $timeout, ConnexionService){
                    if(!ConnexionService.estConnecte()){
                        $timeout(function(){
                            $state.go('index');
                        }, 10);
                    }
                }]
            })
    });