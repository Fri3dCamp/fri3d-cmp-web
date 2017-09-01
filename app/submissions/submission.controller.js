(function () {

  'use strict';

  angular
    .module('app')
    .controller('SubmissionController', SubmissionController);

    SubmissionController.$inject = ['$scope', '$location', 'comments', 'submission', 'language', 'SubmissionService', '$translate', '$mdToast', '$mdDialog', 'webStorageService'];

  function SubmissionController($scope, $location, comments, submission, language, SubmissionService, $translate, $mdToast, $mdDialog, webStorageService) {
      let vm = this;

      // -- get the search arguments from the url and check if a lang query is available.
      let searchArgs = $location.search();
      vm.lang = searchArgs['lang'] || 'nl';

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
    vm.comments = comments;
    vm.submission = submission;
    vm.statusTypes = ["PROPOSED", "UNDER_REVIEW", "ACCEPTED", "MAYBE", "REJECTED", "IN_PREPARATION"];
    vm.formatTypes = [ "FULLTIME", "WALK-IN" ];
    vm.audienceLevels = [ "FAMILY", "EXPERT", "NOT_IN_LIST" ];
    vm.timeBuckets = _generateTimeBuckets();

    if (webStorageService.get('pending_submission', 'sessionStorage')) {
        vm.submission = webStorageService.get('pending_submission', 'sessionStorage');
        webStorageService.remove('pending_submission', 'sessionStorage');
    }

    // -- functions
    vm.save = save;
    vm.showNewCollaboratorDialog = showNewCollaboratorDialog;
    vm.editCollaborator = editCollaborator;
    vm.removeCollaborator = removeCollaborator;

      vm.toggle = toggle;
      vm.inList = inList;

      function inList(item, list) {
          return list.indexOf(item) > -1;
      }

      function toggle(item, list) {
          let idx = list.indexOf(item);
          if (idx > -1) {
              list.splice(idx, 1);
          }
          else {
              list.push(item);
          }
      }

    function save() {
        if (vm.ready_to_publish) {
            vm.submission.status = "PROPOSED";
        }

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
