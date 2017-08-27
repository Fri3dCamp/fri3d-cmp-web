(function () {

  'use strict';

  angular
    .module('app')
    .factory('Settings', Settings);

  Settings.$inject = ['$location'];

  function Settings($location) {
    let settings = {
      // api: 'https://api.fri3d.be'
      api: 'http://localhost:31000'
    };

    // var port = $location.protocol() === "http" ? 8080 : 8443;
    //
    // if ($location.host() === "localhost") {
    //     settings.api = $location.protocol() + "://localhost:31000";
    // } else if ($location.host() === "api.fri3d.be" ) {
    //     settings.api = $location.protocol() + "://api.fri3d.be:" + port;
    // }

    return settings;
  }

})();
