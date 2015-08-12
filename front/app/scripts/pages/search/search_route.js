angular.module('mjTables').

    config(function($stateProvider){
        $stateProvider
            .state('search', {
                url: "/search",
                templateUrl: 'partials/search.jade',
                controller: 'SearchCtrl',
                onEnter: ['$state', '$timeout', 'ConnexionService', function($state, $timeout, ConnexionService){
                    if(!ConnexionService.estConnecte()){
                        $timeout(function(){
                            $state.go('index');
                        }, 10);
                    }
                }]
            })
    });