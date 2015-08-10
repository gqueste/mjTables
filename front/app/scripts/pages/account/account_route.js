angular.module('mjTables').

    config(function($stateProvider){
        $stateProvider
            .state('account', {
                url: "/account",
                templateUrl: 'partials/account.jade',
                controller: 'AccountCtrl',
                onEnter: ['$state', '$timeout', 'ConnexionService', function($state, $timeout, ConnexionService){
                    if(!ConnexionService.estConnecte()){
                        $timeout(function(){
                            $state.go('index');
                        }, 10);
                    }
                }]
            })
    });