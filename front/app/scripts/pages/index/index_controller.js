angular.module('mjTables').

    controller('IndexCtrl', ['User', function(User){
        User.getAll()
            .then(function(data){
                console.log(data);
            })
            .catch(function(error){
                console.log(error);
            });

    }]);