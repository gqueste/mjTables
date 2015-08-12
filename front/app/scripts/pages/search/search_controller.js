angular.module('mjTables').

    controller('SearchCtrl', ['$scope', 'UserAPI', 'TableAPI', 'StatusAPI', 'FrequenceAPI', function($scope, UserAPI, TableAPI, StatusAPI, FrequenceAPI){

        $scope.resultats = [];
        $scope.status = [];
        $scope.frequences = [];
        $scope.statutsSelected = {};
        $scope.frequencesSelected = {};

        init();

        function init(){
            StatusAPI.getAll().then(function(status){
                $scope.status = status;
                FrequenceAPI.getAll().then(function(frequences){
                    $scope.frequences = frequences;
                }).catch(function(error){
                    console.log(error);
                })
            }).catch(function(error){
                console.log(error);
            })
        }

    }]);