angular.module('mjTables').

    config(function($stateProvider){
        $stateProvider
            .state('user', {
                url: "/user/:id",
                templateUrl: 'partials/user.jade',
                controller: 'UserCtrl',
                onEnter: ['$state', '$timeout', 'ConnexionService', '$stateParams', function($state, $timeout, ConnexionService, $stateParams){
                    if(!ConnexionService.estConnecte() || !$stateParams.id){
                        $timeout(function(){
                            $state.go('index');
                        }, 10);
                    }
                }]
            })
    });