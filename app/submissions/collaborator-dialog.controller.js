(function () {

  'use strict';

  angular
    .module('app')
    .controller('CollaboratorDialogController', CollaboratorDialogController);

    CollaboratorDialogController.$inject = ['$scope', '$mdDialog'];

  function CollaboratorDialogController($scope, $mdDialog) {
      $scope.hide = function() {
          $mdDialog.hide();
      };

      $scope.cancel = function() {
          $mdDialog.cancel();
      };

      $scope.answer = function(answer) {
          $mdDialog.hide(answer);
      };
  }
})();
