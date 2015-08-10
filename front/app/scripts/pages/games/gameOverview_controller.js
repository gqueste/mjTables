angular.module('mjTables').

    controller('GameOverviewCtrl', ['$scope', '$state', '$stateParams', function($scope, $state, $stateParams){

        $scope.id = $stateParams.id;

    }]);