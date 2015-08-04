angular.module('mjTables').

    config(function($routeProvider, RestangularProvider, $urlRouterProvider){
        $urlRouterProvider.otherwise('/');

        RestangularProvider.setBaseUrl('./api/v1');
    });