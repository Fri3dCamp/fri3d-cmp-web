(function () {

    'use strict';

    angular
        .module('app')
        .factory('SubmissionService', SubmissionService);

    SubmissionService.$inject = ['Settings', '$resource'];

    function SubmissionService(Settings, $resource) {
        let resource = $resource(
          Settings.api + '/v1/submissions/:submissionId',
          { submissionId: '@submissionId'},
          {
              'get': { method: 'GET', isArray: false},
              'save': { method: 'POST' }
          });

        return {
          get: getSubmission,
          save: saveSubmission
        };

        function getSubmission(submissionId) {
            return resource.get({submissionId: submissionId}).$promise;
        }

        function saveSubmission(submission) {
            return resource.save({}, submission).$promise;
        }



    }

})();
