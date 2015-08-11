angular.module('mjTables').

    controller('MailCtrl', ['$scope', '$rootScope', '$modalInstance', 'destinatairesIds', 'envoyeurId', 'UserAPI', function($scope, $rootScope, $modalInstance, destinatairesIds, envoyeurId, UserAPI){

        $scope.mail = {};

        init();

        function init(){
            UserAPI.getUser(envoyeurId).then(function(user){
                $scope.mail.envoyeur = user;
            });
            $scope.mail.destinataires = [];
            for(var i = 0; i < destinatairesIds.length; i++){
                UserAPI.getUser(destinatairesIds[i]).then(function(user){
                    $scope.mail.destinataires.push(user);
                }).catch(function(error){
                    console.log(error);
                })
            }
        }


        $scope.ok = function () {
            $modalInstance.close($scope.game);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };


    }]);