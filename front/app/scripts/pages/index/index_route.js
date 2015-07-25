angular.module('mjTables').

    config(function($stateProvider){
        $stateProvider
            .state('index', {
                url: "/",
                templateUrl: 'partials/index.jade',
                controller: 'IndexCtrl',
                onEnter: ['$state', function($state){
                    //redirige vers la page de connexion si la Connexion n'existe pas
                    /*
                    if(!ConnexionService.estConnecte()){
                        $state.go('connexion');
                    }*/
                }]
            })
    });