angular.module('mjTables').

    config(function($stateProvider){
        $stateProvider
            .state('tablesOverview', {
                url: "/tables",
                templateUrl: 'partials/tablesOverview.jade',
                controller: 'TablesOverviewCtrl',
                onEnter: ['$state', '$timeout', 'ConnexionService', function($state, $timeout, ConnexionService){
                     if(!ConnexionService.estConnecte()){
                         $timeout(function(){
                             $state.go('index');
                         }, 10);
                     }
                }]
            })
    });