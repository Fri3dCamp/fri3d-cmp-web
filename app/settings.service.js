(function () {

  'use strict';

  angular
    .module('app')
    .factory('Settings', Settings);

  Settings.$inject = ['$location'];

  function Settings($location) {
    let settings = {
      api: 'http://localhost:31000'
    }

    if ($location.host() === "localhost") {
      settings.api = $location.protocol() + "://localhost:31000";
    } else {

    }

    return settings;
  }

})();
