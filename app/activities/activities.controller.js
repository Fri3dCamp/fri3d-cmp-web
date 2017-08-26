(function () {

  'use strict';

  angular
    .module('app')
    .controller('ActivitiesController', ActivitiesController);

    ActivitiesController.$inject = ['authService', '$mdToast', 'ModelService', 'ModelDetailDialog'];

  function ActivitiesController(authService, $mdToast, ModelService, ModelDetailDialog) {

    let vm = this;
    vm.auth = authService;
    vm.search = null;

    vm.query = function() {



      if (authService.getCachedProfile()) {
        vm.profile = authService.getCachedProfile();

        return ModelService.list(vm.profile.nickname, vm.search).then(function(result) {
          vm.models = result.data;
        })
      } else {
        authService.getProfile(function (err, profile) {
          vm.profile = profile;

          return ModelService.list(vm.profile.nickname, vm.search).then(function(result) {
            vm.models = result.data;
          })

        });
      }
    }

    vm.edit = function(ev, model) {
      ModelService.get(model.namespace, model.name).then(function(result) {
        ModelDetailDialog.edit(ev, result)
          .then(function(model) {
            ModelService.update(model).then(function() {
              $mdToast.show(
                $mdToast.simple()
                  .textContent('Model Saved!')
                  .hideDelay(3000)
              );

              return vm.query();
            }, function(err) {
              $mdToast.show(
                $mdToast.simple()
                  .textContent('Unable to save model: ' + err.message)
                  .hideDelay(5000)
              );
            });
          }, function() {});
      });
    }

    vm.remove = function(ev, model) {
      ModelService.remove(model.namespace, model.name).then(function() {
        $mdToast.show(
          $mdToast.simple()
            .textContent('Model Removed!')
            .hideDelay(3000)
        );

        return vm.query();
      }, function(err) {
        $mdToast.show(
          $mdToast.simple()
            .textContent('Unable to remove model: ' + err.message)
            .hideDelay(5000)
        );
      });
    }

    vm.new = function(ev) {
      ModelDetailDialog.create(ev, authService.profile().nickname).then(function(model) {
        ModelService.create(model).then(function() {
          return vm.query();
        }, function(err) {
          $mdToast.show(
            $mdToast.simple()
              .textContent('Unable to save model: ' + err.message)
              .hideDelay(5000)
          );
        });
      }, function() {});
    }


    vm.query();
  }

})();
