angular.module('mjTables').

    config(function($routeProvider, RestangularProvider, $urlRouterProvider){
        $urlRouterProvider.otherwise('/');

        RestangularProvider.setBaseUrl('http://localhost:3000/api/v1');
    });