(function () {

  'use strict';

  angular
    .module('app')
    .controller('SubmissionController', SubmissionController);

    SubmissionController.$inject = ['$location', 'submission', 'SubmissionService', '$translate', '$mdToast', '$mdDialog'];

  function SubmissionController($location, submission, SubmissionService, $translate, $mdToast, $mdDialog) {
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
    vm.statusTypes = ["PROPOSED", "UNDER_REVIEW", "ACCEPTED", "MAYBE", "REJECTED", "IN_PREPARATION"];
    vm.types = [ "WORKSHOP", "TALK", "GAME", "NOT_IN_LIST" ];
    vm.attendanceTypes = [ "FULLTIME", "WALK-IN" ];
    vm.audienceLevels = [ "FAMILY", "EXPERT", "NOT_IN_LIST" ];
    vm.locationTypes = [ "NONE", "ORGA_TALK", "ORGA_WORKSHOP", "ORGA_OUTDOOR", "DRONE", "FOREST", "NOT_IN_LIST"];
    vm.timeBuckets = _generateTimeBuckets();

    // -- functions
    vm.save = save;
    vm.publish = publish;
    vm.showNewCollaboratorDialog = showNewCollaboratorDialog;

    function save() {
      SubmissionService.save(vm.submission).then(function(response) {
          vm.submission.id = response._id;

        $mdToast.show(
            $mdToast.simple()
                .textContent('Saved!')
                .hideDelay(3000)
        );

        $location.path("/submission/" + vm.submission.id);
      });
    }

    function publish() {
        $mdToast.show(
            $mdToast.simple()
                .textContent('Not implemented yet!')
                .hideDelay(3000)
        );
    }

      function showNewCollaboratorDialog(ev) {
          $mdDialog.show({
              controller: CollaboratorDialogController,
              templateUrl: '/app/submissions/collaborator-dialog.html',
              parent: angular.element(document.body),
              targetEvent: ev,
              clickOutsideToClose:true
          })
              .then(function(answer) {
                  $scope.status = 'You said the information was "' + answer + '".';
              }, function() {
                  $scope.status = 'You cancelled the dialog.';
              });
      }

    function _generateTimeBuckets() {
        let res = [];

        for (let x = 0; x < 24; x++) {
            res.push(x + ":00");
            res.push(x + ":15");
            res.push(x + ":30");
            res.push(x + ":45");
        }

        return res;
    }
  }
})();
