angular.module('mjTables').

    controller('RegisterCtrl', ['$scope', 'UserAPI', function($scope, UserAPI){

        $scope.username = '';
        $scope.mail = '';
        $scope.password = '';
        $scope.passwordVerif = '';

        $scope.register = function(){
            initErrors();
            if($scope.username === ''){
                $scope.usernameError = "Il manque un nom d'utilisateur. ";
                $scope.errorMessage += $scope.usernameError;
            }
            if($scope.mail === ''){
                $scope.mailError = "Il manque un nom d'utilisateur. ";
                $scope.errorMessage += $scope.mailError;
            }
            if($scope.password === ''){
                $scope.passwordError = "Il manque un mot de passe. ";
                $scope.errorMessage += $scope.passwordError;
            }
            if($scope.passwordVerif === ''){
                $scope.passwordVerifError = "Il manque la verification du mot de passe. ";
                $scope.errorMessage += $scope.passwordVerifError
            }
            if($scope.password !== $scope.passwordVerif){
                $scope.verifError = "Mot de passe et verification incorrects. ";
                $scope.errorMessage += $scope.verifError;
            }
            control();
        };

        var control = function(){
            UserAPI.findByUsername($scope.username).then(function(users){
                console.log(users);
            }).catch(function(error){
                console.log(error);
            })
        };

        var initErrors = function(){
            $scope.errorMessage = '';
            $scope.usernameError = '';
            $scope.mailError = '';
            $scope.passwordError = '';
            $scope.passwordVerifError = '';
            $scope.verifError = '';
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
        }

    }]);