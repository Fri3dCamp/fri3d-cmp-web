(function () {

  'use strict';

  angular
    .module('app')
    .controller('CollaboratorDialogController', CollaboratorDialogController);

    CollaboratorDialogController.$inject = ['$scope', '$mdDialog', 'collaborator'];

  function CollaboratorDialogController($scope, $mdDialog, collaborator) {
      $scope.model = collaborator;

      $scope.hide = function() {
          $mdDialog.hide();
      };

      $scope.cancel = function() {
          $mdDialog.cancel();
      };

      $scope.save = function() {
          $mdDialog.hide($scope.model);
      };
  }
})();
