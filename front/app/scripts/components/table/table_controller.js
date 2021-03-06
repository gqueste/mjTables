angular.module('mjTables').

    controller('TableCtrl', ['$scope', '$rootScope', 'TableAPI', 'UserAPI', 'ConnexionService', '$modal', '$q', function($scope, $rootScope, TableAPI, UserAPI, ConnexionService, $modal, $q){

        $scope.table = {};
        $scope.players = [];
        $scope.messageErreur = '';
        $scope.messageSuccess = '';
        $scope.ConnexionService = ConnexionService;

        init();

        function init(messageErreur, messageSuccess){
            $scope.players = [];
            $scope.messageErreur = messageErreur;
            $scope.messageSuccess = messageSuccess;
            TableAPI.getTable($scope.tableid)
                .then(function(table){
                    $scope.table = table;
                    return TableAPI.getPlayersForTable($scope.tableid)
                })
                .then(function(players_ids){
                    return $q.all(players_ids.map(function(playerId){
                        return UserAPI.getUser(playerId.user_id);
                    }));
                })
                .then(function(players){
                    $scope.players = players;
                })
                .catch(function(error){
                   console.log(error);
                });
        }

        $scope.isAdmin = function(){
            return $scope.table.mj_id == ConnexionService.getCurrentUserId();
        };

        $scope.isAlreadyPlayer = function(){
            var ret = false;
            for(var i = 0; i < $scope.players.length; i++){
                if($scope.players[i].id == ConnexionService.getCurrentUserId()){
                    ret = true;
                    break;
                }
                }
            return ret;
        };

        $scope.openModalEdit = function(){
            var modalInstance = $modal.open({
                templateUrl: 'scripts/components/table/modal/editTableModal.html',
                controller: 'editTableModalCtrl',
                size: 'lg',
                resolve:{
                    idTable: function () {
                        return $scope.tableid;
                    }
                }
            });

            modalInstance.result.then(function(updatedTable){
                var message = 'Table <strong>' + updatedTable.nom + '</strong> a été mise à jour';
                init(null, message);
            });
        };

        $scope.openModalMail = function(){
            var modalInstance = $modal.open({
                templateUrl: 'scripts/components/mails/mailModal.html',
                controller: 'MailCtrl',
                size: 'lg',
                resolve:{
                    envoyeurId: function () {
                        return ConnexionService.getCurrentUserId();
                    },
                    destinatairesIds: function(){
                        return getAllInvolvedIds();
                    },
                    idTable: function(){
                        return $scope.tableid;
                    }
                }
            });

            modalInstance.result.then(function(){
                var message = 'Un mail a bien été envoyé.';
                init(null, message);
            });
        };

        $scope.removePlayer = function(user_id){
            TableAPI.removePlayerFromTable($scope.tableid, user_id).then(function(){
                if($scope.refreshOnPlayerMovement){
                    var message = 'Un joueur a bien été retiré de la table.';
                    init(null, message);
                }
                $rootScope.$broadcast('playerRemoved', {table_id : $scope.tableid, user_id : user_id});
            }).catch(function(error){
                console.log(error);
            });
        };

        $scope.rejoindreTable = function(){
            TableAPI.addPlayerToTable($scope.tableid, ConnexionService.getCurrentUserId()).then(function(){
                if($scope.refreshOnPlayerMovement){
                    var message = 'Un joueur a bien été ajouté.';
                    init(null, message);
                }
                $rootScope.$broadcast('playerAdded', {table_id : $scope.tableid, user_id : ConnexionService.getCurrentUserId()});
            }).catch(function(error){
                console.log(error);
            });
        };

        $scope.openModalDelete = function() {
            var modalInstance = $modal.open({
                templateUrl: 'scripts/components/table/modal/deleteTableModal.html',
                controller: 'deleteTableModalCtrl',
                size: 'sm',
                resolve:{
                    idTable: function () {
                        return $scope.tableid;
                    },
                    nomTable: function() {
                        return $scope.table.table_nom;
                    }
                }
            });

            modalInstance.result.then(function(){
                $rootScope.$broadcast('tableDeleted', {table_nom : $scope.table.table_nom});
            });
        };

        $scope.getClasseLabelStatut = function(libelle){
            var ret = {};
            ret.label = true;
            switch (libelle) {
                case 'Recrute' :
                    ret['label-success'] = true;
                    break;
                case 'Places disponibles' :
                    ret['label-primary'] = true;
                    break;
                case 'Complète' :
                    ret['label-danger'] = true;
                    break;
                case 'En pause' :
                    ret['label-warning'] = true;
                    break;
                case 'Arrêtée' :
                    ret['label-default'] = true;
                    break;
            }
            return ret;
        };

        function getAllInvolvedIds(){
            var ret = [];
            ret.push($scope.table.mj_id);
            for(var i = 0; i < $scope.players.length; i++){
                ret.push($scope.players[i].id);
            }
            return ret;
        }
    }]);
