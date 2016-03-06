angular.module('mjTables').

    controller('MailCtrl', ['$scope', '$rootScope', '$modalInstance', 'destinatairesIds', 'envoyeurId', 'UserAPI', 'idTable', 'TableAPI', 'TextAngularService', '$q', function($scope, $rootScope, $modalInstance, destinatairesIds, envoyeurId, UserAPI, idTable, TableAPI, TextAngularService, $q){

        $scope.mail = {};
        $scope.textAngular = TextAngularService;

        init();

        function init(){
            UserAPI.getUser(envoyeurId)
                .then(function(user){
                    $scope.mail.envoyeur = user;
                    $scope.mail.destinataires = [];

                    return $q.all(destinatairesIds.map(function(destinataireId){
                        if(destinataireId != envoyeurId){
                            return UserAPI.getUser(destinataireId);
                        }
                    }));
                })
                .then(function(users){
                    $scope.mail.destinataires = users;
                    $scope.mail.destinataires.push($scope.mail.envoyeur);
                })
            ;

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
