angular.module('mjTables').

    config(function($routeProvider, RestangularProvider){
        $routeProvider
            .when('/', {
                templateUrl: 'partials/index.jade',
                controller: 'IndexCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });

        RestangularProvider.setBaseUrl('http://localhost:3000/api/v1');
    });