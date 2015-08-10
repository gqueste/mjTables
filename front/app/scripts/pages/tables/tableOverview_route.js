angular.module('mjTables').

    config(function($stateProvider){
        $stateProvider
            .state('table', {
                url: "/tables/:id",
                templateUrl: 'partials/table.jade',
                controller: 'TableOverviewCtrl',
                onEnter: ['$state', '$stateParams', '$timeout', 'ConnexionService', function($state, $stateParams, $timeout, ConnexionService){
                    if(!ConnexionService.estConnecte()){
                        $timeout(function(){
                            $state.go('index');
                        }, 10);
                    }
                    else{
                        if(!$stateParams.id){
                            $timeout(function(){
                                $state.go('tablesOverview');
                            }, 10);
                        }
                    }
                }]
            })
    });