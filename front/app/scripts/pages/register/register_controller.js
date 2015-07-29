angular.module('mjTables').

    controller('RegisterCtrl', ['$scope', 'UserAPI', function($scope, UserAPI){

        $scope.username = '';
        $scope.mail = '';
        $scope.password = '';
        $scope.passwordVerif = '';

        $scope.register = function(){
            control();
        };

        var control = function(){
            console.log('hello');
        };

        $scope.controlUsername = function(){
            $scope.usernameError = '';
            if($scope.username !== ''){
                UserAPI.findByUsername($scope.username).then(function(users){
                    if(users.length > 0){
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
                        if(users.length > 0){
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
                    $scope.passwordError = "5 caractères ou plus pour votre mot de passe.";
                }
            }
        };

        $scope.controlVerifPassword = function(){
            $scope.passwordVerifError = '';
            if($scope.passwordVerif !== ''){
                if($scope.password !== $scope.passwordVerif){
                    $scope.passwordVerifError = "Le mot de passe et la vérification ne sont pas identiques";
                }
            }
        };

        $scope.registerDisabled = function(){
            return !$scope.username || !$scope.mail || !$scope.password || !$scope.passwordVerif
                || $scope.usernameError || $scope.mailError || $scope.passwordError
                || $scope.passwordVerifError || $scope.verifError;
        }

    }]);