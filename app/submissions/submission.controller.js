(function () {

  'use strict';

  angular
    .module('app')
    .controller('SubmissionController', SubmissionController);

    SubmissionController.$inject = ['$location', 'submission', 'SubmissionService', '$translate', '$mdToast'];

  function SubmissionController($location, submission, SubmissionService, $translate, $mdToast) {
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

    // -- variables
    vm.submission = submission;
    vm.types = [
        "WORKSHOP",
        "TALK"
    ];

    vm.attendanceTypes = [ "FULLTIME", "WALK-IN" ];

    // -- functions
    vm.save = save;
    vm.publish = publish;

    function save() {
      SubmissionService.save(vm.submission).then(function() {
        $mdToast.show(
            $mdToast.simple()
                .textContent('Saved!')
                .hideDelay(3000)
        );
      });
    }

    function publish() {
        $mdToast.show(
            $mdToast.simple()
                .textContent('Not implemented yet!')
                .hideDelay(3000)
        );
    }
  }
})();
