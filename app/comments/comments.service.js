(function () {

    'use strict';

    angular
        .module('app')
        .factory('CommentsService', CommentsService);

    CommentsService.$inject = ['Settings', '$resource'];

    function CommentsService(Settings, $resource) {
        let resource = $resource(
          Settings.api + '/v1/comments/:commentId',
          { commentId: '@commentId'},
          {
              'list': { method: 'GET', isArray: false},
          });

        return {
          list: listComments
        };

        function listComments(submissionId) {
            return resource.list({submissionId: submissionId}).$promise;
        }


    }

})();
