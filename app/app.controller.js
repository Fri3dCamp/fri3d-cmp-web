(function () {

  'use strict';

  angular
    .module('app')
    .controller('AppController', AppController);

  AppController.$inject = ['$translate'];

  function AppController($translate) {

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

  }

})();
