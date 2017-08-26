(function () {

  'use strict';

  angular
    .module('app')
    .controller('CallbackController', callbackController);

  callbackController.$Inject = ["authService"]

  function callbackController(authService) {
  }

})();
