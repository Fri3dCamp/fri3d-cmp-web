(function () {

  'use strict';

  angular
    .module('app')
    .controller('SubmissionController', SubmissionController);

    SubmissionController.$inject = ['$scope', '$location', 'comments', 'submission', 'language', 'SubmissionService', '$translate', '$mdToast', '$mdDialog', 'webStorageService', '$window', '$anchorScroll'];

  function SubmissionController($scope, $location, comments, submission, language, SubmissionService, $translate, $mdToast, $mdDialog, webStorageService, $window, $anchorScroll) {
      let vm = this;
      let submission_was_empty = (('id' in submission) && (submission.id.length > 0)) ? false : true;

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
    vm.comments = comments;
    vm.submission = submission;
    vm.statusTypes = ["PROPOSED", "UNDER_REVIEW", "ACCEPTED", "MAYBE", "REJECTED", "IN_PREPARATION"];
    vm.audienceLevels = [ "LEVEL_BEGINNER", "LEVEL_INTERMEDIATE", "LEVEL_EXPERT", "LEVEL_FAMILY", "LEVEL_CHILD", "LEVEL_ADULT" ];
    vm.submission_was_empty = submission_was_empty;

    if (webStorageService.get('pending_submission', 'sessionStorage')) {
        vm.submission = webStorageService.get('pending_submission', 'sessionStorage');
        webStorageService.remove('pending_submission', 'sessionStorage');
    }

    // -- functions
    vm.select_type = function select_type(type) {
      vm.submission.type = type;
      // delayed due to still-to-appear field at first selection
      setTimeout(function() { document.getElementById("submission_title").focus(); }, 100);
    };

    vm.save = save;
    vm.showNewCollaboratorDialog = showNewCollaboratorDialog;
    vm.editCollaborator = editCollaborator;
    vm.removeCollaborator = removeCollaborator;
    vm.validityToString = validityToString;

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

      function validityToString(validity) {
          let res = [];
          if (! validity) return res;

          if (validity.badInput) res.push('invalid');
          if (validity.customError) res.push('custom');
          if (validity.patternMismatch) res.push('pattern');
          if (validity.rangeOverflow) res.push('min');
          if (validity.rangeUnderflow) res.push('max');
          if (validity.stepMismatch) res.push('step');
          if (validity.tooLong) res.push('maxlength');
          if (validity.tooShort) res.push('minlength');
          if (validity.typeMismatch) res.push('type');
          if (validity.valid) res.push('valid');
          if (validity.valueMissing) res.push('required');

          return res;
      }

    function emptySubmission() {
      // TODO FIXME tried to stick this in the service, but trying
      // to call that from app.config.js (after injecting it) yields
      // an errorless white page, so duplicated here
        return {
            affiliated: false,
            status: "IN_PREPARATION",
            activity_participant_limit: 25,
            always_available: true,
            day_1_available: true,
            day_1_from: 9,
            day_1_until: 21,
            day_2_available: true,
            day_2_from: 9,
            day_2_until: 21,
            day_3_available: true,
            day_3_from: 9,
            day_3_until: 21,
            costs: 0,
            multiple_sessions: false,
            session_count: 2,
            open_for_all: true,
            audience_level: [],
            open_for_repetitions: true,
            format: false,
            activity_duration: 60,
            visit_duration: 15
        };
    }

    function reset() {
      // TODO XXX FIXME check if this covers all our bases
      vm.submission = emptySubmission();
      vm.comments = comments;
    }

    function save() {
      vm.submission.status = "PROPOSED";

      // patch meta info into form
      vm.submission.form_language = vm.lang;

      SubmissionService.save(vm.submission).then(function(response) {
          vm.submission.id = response._id;

        $mdToast.show(
            $mdToast.simple()
                .textContent('Saved!')
                .hideDelay(3000)
        );

        // if we came here with an empty form, reset so the user can
        // fill in again
        if (submission_was_empty) {
          $mdDialog.show($mdDialog.alert()
            .title($translate.instant('SAVED_DIALOG_HEADER'))
            .textContent($translate.instant('SAVED_DIALOG_CONTENTS'))
            .ok($translate.instant('SAVED_DIALOG_OK'))
          );
          $anchorScroll('main');
          reset();
        } else {
          $mdDialog.show($mdDialog.alert()
            .title($translate.instant('UPDATED_DIALOG_HEADER'))
            .textContent($translate.instant('UPDATED_DIALOG_CONTENTS'))
            .ok($translate.instant('UPDATED_DIALOG_OK'))
          );
          $anchorScroll('main');
        }

      });
    }

      function showNewCollaboratorDialog(ev) {
          function afterShowDialog(scope, element, options) {
              var element = window.document.getElementById('collab_dialog_add_name');
              if (element)
                  element.focus();
          }
          $mdDialog.show({
              controller: 'CollaboratorDialogController',
              templateUrl: '/app/submissions/collaborator-dialog.html',
              parent: angular.element(document.body),
              targetEvent: ev,
              clickOutsideToClose:true,
              onComplete: afterShowDialog,
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
        function afterShowDialog(scope, element, options) {
            var element = window.document.getElementById('collab_dialog_add_name');
            if (element) {
              element.focus();
              element.setSelectionRange(0, element.value.length)
            }
        }

        var idx = vm.submission.collaborators.indexOf(collaborator);

          $mdDialog.show({
              controller: 'CollaboratorDialogController',
              templateUrl: '/app/submissions/collaborator-dialog.html',
              parent: angular.element(document.body),
              targetEvent: ev,
              clickOutsideToClose:true,
              onComplete: afterShowDialog,
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
              .title($translate.instant('COLLABORATORS_DIALOG_REMOVE_HEADER'))
              .textContent($translate.instant('COLLABORATORS_DIALOG_REMOVE_CONTENTS', { collab_name : collaborator.name }))
              .ariaLabel($translate.instant('COLLABORATORS_DIALOG_REMOVE_CONTENTS', { collab_name : collaborator.name }))
              .targetEvent(ev)
              .ok($translate.instant('COLLABORATORS_DIALOG_REMOVE_CONFIRM'))
              .cancel($translate.instant('COLLABORATORS_DIALOG_REMOVE_CANCEL'));


          $mdDialog.show(confirm).then(function() {
              vm.submission.collaborators.splice(vm.submission.collaborators.indexOf(collaborator), 1);
          });
      }

  }
})();
