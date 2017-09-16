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

    // make sure that tweets are transformed by the Twitter JS code
    // NOTE: problem seems when following a link to the page, probably because
    //       the default JS code has already ran before Angular has rendered
    // TODO this function is evaluated multiple times
    vm.forceTwitterRendering = function forceTwitterRendering() {
      twttr.widgets.load();
      return false;
    };
  }

})();
