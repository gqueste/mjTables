angular.module('mjTables').

    controller('MailCtrl', ['$scope', '$rootScope', '$modalInstance', 'destinatairesIds', 'envoyeurId', 'UserAPI', 'idTable', 'TableAPI', function($scope, $rootScope, $modalInstance, destinatairesIds, envoyeurId, UserAPI, idTable, TableAPI){

        $scope.mail = {};

        init();

        function init(){
            UserAPI.getUser(envoyeurId).then(function(user){
                $scope.mail.envoyeur = user;

                $scope.mail.destinataires = [];
                for(var i = 0; i < destinatairesIds.length; i++){
                    if(destinatairesIds[i] != envoyeurId){
                        UserAPI.getUser(destinatairesIds[i]).then(function(user2){
                            $scope.mail.destinataires.push(user2);
                        }).catch(function(error){
                            console.log(error);
                        })
                    }
                }
                $scope.mail.destinataires.push($scope.mail.envoyeur);
            });

        }


        $scope.ok = function () {
            $scope.message = "Mail en cours d'envoi, patientez";
            if(idTable != -1){
                TableAPI.sendMail($scope.mail, idTable).then(function(){
                    $modalInstance.close();
                }).catch(function(error){
                    console.log(error);
                })
            }
            else{
                UserAPI.sendMail($scope.mail).then(function(){
                    $modalInstance.close();
                }).catch(function(error){
                    console.log(error);
                })
            }
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };


    }]);