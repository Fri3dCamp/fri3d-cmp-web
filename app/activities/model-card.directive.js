(function() {

  'use strict';

  angular
    .module('app')
    .directive('modelCard', modelCard);

  function modelCard() {
    return {
      templateUrl: 'app/activities/model-card.html',
      controller: modelCardController,
      controllerAs: 'vm',
      replace: true,
      scope: {
        model: '=',
        onEdit: '&',
        onRemove: '&'
      }
    }
  }

  modelCardController.$inject = ['authService', '$scope', '$mdDialog', '$location'];

  function modelCardController(authService, $scope, $mdDialog, $location) {
    let vm = this;

    vm.auth = authService;
    vm.model = $scope.model;

    vm.edit = function(ev) {
      $scope.onEdit(vm.model);
    }

    vm.remove = function(ev) {
      let confirm = $mdDialog.confirm()
        .title('Would you like to delete the ' + vm.model.name + ' model?')
        .textContent('This is an irreversible action. There is no way of getting your model back once it has been removed.')
        .ariaLabel('Remove Model ' + vm.model.name)
        .targetEvent(ev)
        .ok('Remove')
        .cancel('Cancel');

      $mdDialog.show(confirm).then(function() {
        $scope.onRemove(vm.model);
      });
    }

    vm.editor = function(ev) {
      $location.path('/activities/' + vm.model.namespace + "/" + vm.model.name)
    }
  }

})();
