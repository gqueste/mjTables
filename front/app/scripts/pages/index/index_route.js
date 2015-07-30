angular.module('mjTables').

    config(function($stateProvider){
        $stateProvider
            .state('index', {
                url: "/",
                templateUrl: 'partials/index.jade',
                controller: 'IndexCtrl',
                onEnter: ['$state', '$timeout', 'ConnexionService', function($state, $timeout, ConnexionService){
                    if(ConnexionService.estConnecte()){
                        $timeout(function(){
                            $state.go('tablesOverview');
                        }, 10);
                    }
                }]
            })
    });