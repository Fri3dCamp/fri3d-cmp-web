(function () {

  'use strict';

  angular
    .module('app')
    .controller('SubmissionController', SubmissionController);

    SubmissionController.$inject = ['$location', 'comments', 'submission', 'SubmissionService', '$translate', '$mdToast', '$mdDialog'];

  function SubmissionController($location, comments, submission, SubmissionService, $translate, $mdToast, $mdDialog) {
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
      vm.comments = comments;
    vm.submission = submission;
    vm.statusTypes = ["PROPOSED", "UNDER_REVIEW", "ACCEPTED", "MAYBE", "REJECTED", "IN_PREPARATION"];
    vm.formatTypes = [ "FULLTIME", "WALK-IN" ];
    vm.audienceLevels = [ "FAMILY", "EXPERT", "NOT_IN_LIST" ];
    vm.timeBuckets = _generateTimeBuckets();

    // -- functions
    vm.save = save;
    vm.publish = publish;
    vm.showNewCollaboratorDialog = showNewCollaboratorDialog;
    vm.editCollaborator = editCollaborator;
    vm.removeCollaborator = removeCollaborator;

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
              controller: 'CollaboratorDialogController',
              templateUrl: '/app/submissions/collaborator-dialog.html',
              parent: angular.element(document.body),
              targetEvent: ev,
              clickOutsideToClose:true,
              locals: {
                  collaborator: {}
              }
          })
              .then(function(collaborator) {
                  if (! vm.submission.collaborators) vm.submission.collaborators = [];
                  vm.submission.collaborators.push(collaborator)
              });
      }

      function editCollaborator(ev, collaborator) {
        var idx = vm.submission.collaborators.indexOf(collaborator);

          $mdDialog.show({
              controller: 'CollaboratorDialogController',
              templateUrl: '/app/submissions/collaborator-dialog.html',
              parent: angular.element(document.body),
              targetEvent: ev,
              clickOutsideToClose:true,
              locals: {
                  collaborator: collaborator
              }
          })
              .then(function(collaborator) {
                  vm.submission.collaborators[idx] = collaborator;
              });
      }

      function removeCollaborator(ev, collaborator) {
          var confirm = $mdDialog.confirm()
              .title('Remove Collaborator?')
              .textContent('Do you want to remove ' + collaborator.name + ' from the list of collaborators?')
              .ariaLabel('Remove Collaborator')
              .targetEvent(ev)
              .ok('Remove')
              .cancel('Cancel');

          $mdDialog.show(confirm).then(function() {
              vm.submission.collaborators.splice(vm.submission.collaborators.indexOf(collaborator), 1);
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
