angular.module('mjTables').

    controller('HeaderCtrl', ['$scope', 'ConnexionService', '$state', function($scope, ConnexionService, $state){
        $scope.ConnexionService = ConnexionService;

        $scope.logout = function(){
            ConnexionService.logOut();
            $state.go('index');
        };
    }]);