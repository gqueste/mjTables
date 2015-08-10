angular.module('mjTables').

    controller('AccountCtrl', ['$scope', '$rootScope', 'UserAPI', '$state', 'ConnexionService', function($scope, $rootScope, UserAPI, $state, ConnexionService){

        $scope.username = '';
        $scope.mail = '';
        $scope.password = '';
        $scope.passwordVerif = '';
        $scope.messageSuccess = '';

        init();

        function init(message){
            $scope.passwordVerifError = '';
            $scope.password = '';
            $scope.passwordVerif = '';
            $scope.messageSuccess = message;
            UserAPI.getUser(ConnexionService.getCurrentUserId()).then(function(user){
                $scope.username = user.username;
                $scope.mail = user.email;
            })
        }

        $scope.saveChanges = function(){
            var user = {
                username : $scope.username,
                email : $scope.mail
            };
            if($scope.password){
                user.newPassword = $scope.password;
                user.oldPassword = $scope.passwordVerif;
            }
            UserAPI.updateUser(ConnexionService.getCurrentUserId(), user).then(function(){
                var message = 'Votre compte a été mis à jour.';
                $rootScope.$broadcast('accountUpdated');
                init(message);
            }).catch(function(error){
                    if(error.data){
                        $scope.passwordVerifError = error.data;
                    }
                    else{
                        console.log(error);
                    }
                }
            );
        };

        $scope.controlUsername = function(){
            $scope.usernameError = '';
            if($scope.username !== ''){
                UserAPI.findByUsername($scope.username).then(function(users){
                    if(users.length > 0 && users[0].id != ConnexionService.getCurrentUserId()){
                        $scope.usernameError = "Il existe deja quelqu'un avec ce pseudo.";
                    }
                }).catch(function(error){
                    console.log(error);
                });
            }
        };

        $scope.controlMail = function(){
            $scope.mailError = '';
            if($scope.mail !== ''){
                if(! /[^\s@]+@[^\s@]+\.[^\s@]+/.test($scope.mail)){
                    $scope.mailError = "Adresse mail non valide.";
                }
                else{
                    UserAPI.findByMail($scope.mail).then(function(users){
                        if(users.length > 0 && users[0].id != ConnexionService.getCurrentUserId()){
                            $scope.mailError = "Il existe deja quelqu'un avec cette adresse";
                        }
                    }).catch(function(error){
                        console.log(error);
                    });
                }
            }
        };

        $scope.controlPassword = function(){
            $scope.passwordError = '';
            if($scope.password !== ''){
                if($scope.password.length < 5){
                    $scope.passwordError = "5 caracteres ou plus pour votre mot de passe.";
                }
            }
        };

        $scope.saveChangesDisabled = function(){
            return !$scope.username || !$scope.mail || $scope.passwordError || $scope.mailError || $scope.usernameError;
        }

    }]);