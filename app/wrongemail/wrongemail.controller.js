(function () {

  'use strict';

  angular
    .module('app')
    .controller('WrongEmailController', WrongEmailController);

    WrongEmailController.$inject = ['$scope', '$location', 'submission', 'SubmissionService', 'language', '$translate', '$mdToast', '$mdDialog', 'webStorageService'];

  function WrongEmailController($scope, $location, submission, SubmissionService, language, $translate, $mdToast, $mdDialog, webStorageService) {
      let vm = this;
      let WRONG_EMAIL_SUFFIX = '.MARKED_AS_WRONG';

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

    if (!submission.speaker_email.endsWith(WRONG_EMAIL_SUFFIX)) {
        submission.speaker_email += WRONG_EMAIL_SUFFIX;
        SubmissionService.save(submission);
    }

    $mdDialog.show($mdDialog.alert()
        .title($translate.instant('WRONG_EMAIL_DIALOG_HEADER'))
        .textContent($translate.instant('WRONG_EMAIL_DIALOG_CONTENTS'))
        .ok($translate.instant('WRONG_EMAIL_DIALOG_OK'))
    );

  }
})();
