angular.module('mjTables').

    controller('HeaderCtrl', ['ConnexionService', '$state', function(ConnexionService, $state){
        $scope.ConnexionService

        $scope.logout = function(){
            ConnexionService.logOut();
            $state.go('index');
        };
    }]);