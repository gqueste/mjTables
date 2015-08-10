angular.module('mjTables').

    controller('HeaderCtrl', ['$scope', 'ConnexionService', '$state', 'UserAPI', function($scope, ConnexionService, $state, UserAPI){
        $scope.ConnexionService = ConnexionService;

        $scope.username = '';

        $scope.$watch(function(){
            return ConnexionService.estConnecte();
        }, function(){
            if(ConnexionService.estConnecte()){
                load();
            }
        });

        $scope.$on('accountUpdated', function(){
            load();
        });

        function load(){
            UserAPI.getUser(ConnexionService.getCurrentUserId()).then(function(user){
                $scope.username = user.username;
            }).catch(function(error){
                console.log(error);
            })
        }

        $scope.logout = function(){
            ConnexionService.logOut();
            $state.go('index');
        };
    }]);