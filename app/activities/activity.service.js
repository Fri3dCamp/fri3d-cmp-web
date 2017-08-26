(function () {

  'use strict';

  angular
    .module('app')
    .factory('ActivityService', ActivityService);

    ActivityService.$inject = ['$resource', 'Settings'];

  function ActivityService($resource, Settings) {
    let resource = $resource(
      Settings.api + '/v1/activities/:namespace/:code',
      { namespace: '@namespace', code: '@code' },
      {
        'list': { method: 'GET', isArray: false, params: { name: null } },
        'get': { method: 'GET', isArray: false},
        'create': { method: 'POST', params: {name: null} },
        'update': { method: 'PUT' },
        'remove': { method: 'DELETE' }
      });

    return {
      list: listModels,
      get: getModel,
      create: createModel,
      update: updateModel,
      remove: removeModel
    };

    function listModels(namespace, namePrefix, fromKey) {
      return resource.list({ namespace: namespace, name: namePrefix, from: fromKey }).$promise;
    }

    function getModel(namespace, name) {
      return resource.get({namespace: namespace, code: name}).$promise;
    }

    function createModel(model) {
      return resource.create({}, model).$promise;
    }

    function updateModel(model) {
      return resource.update({namespace: model.namespace, code: model.name}, model).$promise;
    }

    function removeModel(namespace, name) {
      return resource.remove({namespace: namespace, code: name}).$promise;
    }

  }

})();
