angular.module('mjTables').

    config(function($stateProvider){
        $stateProvider
            .state('table', {
                url: "/tables/:id",
                templateUrl: 'partials/table.jade',
                controller: 'TableOverviewCtrl',
                onEnter: ['$state', '$timeout', 'ConnexionService', function($state, $timeout, ConnexionService){
                    if(!ConnexionService.estConnecte()){
                        $timeout(function(){
                            $state.go('index');
                        }, 10);
                    }
                }]
            })
    });