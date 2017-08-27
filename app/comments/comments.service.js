(function () {

    'use strict';

    angular
        .module('app')
        .factory('CommentsService', CommentsService);

    CommentsService.$inject = ['Settings', '$resource'];

    function CommentsService(Settings, $resource) {
        let submissionComments = $resource(
            Settings.api + '/v1/submissions/:submissionId/comments',
            { submissionId: '@submissionId'},
            {
                'list': { method: 'GET', isArray: false},
            });

        let resource = $resource(
          Settings.api + '/v1/comments/:commentId',
          { commentId: '@commentId'},
          {
              'list': { method: 'GET', isArray: false},
          });

        return {
          list: listComments
        };

        function listComments(submissionId, lastTimestamp) {
            return submissionComments.list({submissionId: submissionId, from_ts: lastTimestamp}).$promise;
        }


    }

})();
