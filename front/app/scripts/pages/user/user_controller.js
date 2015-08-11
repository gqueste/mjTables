angular.module('mjTables').

    controller('UserCtrl', ['$scope', 'UserAPI', 'TableAPI', 'ConnexionService', '$modal', '$state', '$stateParams', function($scope, UserAPI, TableAPI, ConnexionService, $modal, $state, $stateParams){

        $scope.user = {};
        $scope.message = '';
        $scope.tablesMasterisees = [];
        $scope.tablesJouees = [];

        init();

        function init(message){
            $scope.message = message;
            UserAPI.getUser($stateParams.id).then(function(user){
                $scope.user = user;
            }).catch(function(error){
                console.log(error);
            });
            TableAPI.findTablesForMJ($stateParams.id).then(function(tables){
                $scope.tablesMasterisees = tables;
            }).catch(function(error){
                console.log(error);
            });
            TableAPI.findTablesForPlayer($stateParams.id).then(function(tables){
                $scope.tablesJouees = tables;
            }).catch(function(error){
                console.log(error);
            });


        }

        $scope.openSendMailModal = function(){
            var modalInstance = $modal.open({
                templateUrl: 'scripts/components/mails/mailModal.html',
                controller: 'MailCtrl',
                size: 'lg',
                resolve:{
                    envoyeurId: function () {
                        return ConnexionService.getCurrentUserId();
                    },
                    destinatairesIds: function(){
                        return [$scope.user.id];
                    },
                    idTable: function(){
                        return -1;
                    }
                }
            });

            modalInstance.result.then(function(){
                var message = 'Un mail a bien été envoyé.';
                init(message);
            });
        }
    }]);