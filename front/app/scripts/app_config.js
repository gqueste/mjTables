angular.module('mjTables').

    config(function($routeProvider){
        $routeProvider
            .when('/', {
                templateUrl: 'partials/index.jade',
                controller: 'IndexCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    });