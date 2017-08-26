(function () {

  'use strict';

  angular
    .module('app')
    .controller('HomeController', homeController);

  homeController.$inject = ['authService', '$location', '$scope'];

  function homeController(authService, $location, $scope) {

    let vm = this;
    vm.auth = authService;
    vm.profile = null;

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

    vm.query();
  }
})();
