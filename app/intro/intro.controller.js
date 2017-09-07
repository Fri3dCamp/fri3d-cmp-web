(function () {

  'use strict';

  angular
    .module('app')
    .controller('IntroController', IntroController);

    IntroController.$inject = ['$scope', '$location', 'language', '$translate', '$mdToast', '$mdDialog', 'webStorageService'];

  function IntroController($scope, $location, language, $translate, $mdToast, $mdDialog, webStorageService) {
      let vm = this;

      // -- get the search arguments from the url and check if a lang query is available.
      let searchArgs = $location.search();
      vm.lang = searchArgs['lang'] || 'nl';

      vm.scope = $scope;
      vm.translate = vm.lang === 'en';
      $translate.use(vm.lang);

      vm.toggleLanguage = function() {
          webStorageService.set('pending_submission', vm.submission, false);
          if (vm.lang === 'nl') {
              $location.search('lang', 'en').replace();
          } else {
              $location.search('lang', 'nl').replace();
          }
      };

    // -- variables
    vm.promptLanguage = false;
    setTimeout(function(){ vm.promptLanguage = true;  },  250);
    setTimeout(function(){ vm.promptLanguage = false; }, 3000);
  }
})();
