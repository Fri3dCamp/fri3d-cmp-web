(function() {

  'use strict';

  angular
    .module('app')
    .directive('sidebar', sidebar);

  function sidebar() {
    return {
      templateUrl: 'app/sidebar/sidebar.html',
      controller: SideBarController,
      controllerAs: 'vm'
    }
  }

  SideBarController.$inject = ['$scope', 'authService', '$mdToast', '$location'];

  function SideBarController($scope, authService, $mdToast, $location) {
    let vm = this;

    vm.auth = authService;
    vm.perspective = null;

    vm.query = function() {
      if (! vm.auth.isAuthenticated()) return;

      if (authService.getCachedProfile()) {
        vm.profile = authService.getCachedProfile();
      } else {
        authService.getProfile(function (err, profile) {
          vm.profile = profile;
          $scope.$apply();
        });
      }
    };

    vm.goto = function(item) {
      $location.path(item);
    };

    vm.query();
  }

})();

