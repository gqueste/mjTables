angular.module('mjTables').

    config(function($stateProvider){
        $stateProvider
            .state('register', {
                url: "/register",
                templateUrl: 'partials/register.jade',
                controller: 'RegisterCtrl',
                onEnter: ['$state', '$timeout', 'ConnexionService', function($state, $timeout, ConnexionService){
                     if(ConnexionService.estConnecte()){
                         $timeout(function(){
                             $state.go('index');
                         }, 10);
                     }
                }]
            })
    });