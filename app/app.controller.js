(function () {

  'use strict';

  angular
    .module('app')
    .controller('AppController', AppController)
    .controller('AppCtrl', function($scope) {
      $scope.imagePath = '/assets/washedout.png';
    })
    .config(function($mdThemingProvider) {
      $mdThemingProvider.theme('teal').backgroundPalette('teal').dark();
      $mdThemingProvider.theme('lime').backgroundPalette('light-green').dark();
    });

  AppController.$inject = ['$translate'];

  function AppController($translate) {

    let vm = this;
    vm.lang = 'nl';

    vm.languageEn = function() {
        $translate.use('en');
        vm.lang = 'en';
    };

    vm.languageNl = function() {
        $translate.use('nl');
        vm.lang = 'nl';
    };

  }

})();
