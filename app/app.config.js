(function () {
  'use strict';

  angular.module('app').config(config);

  config.$inject = [
      'translations',
    '$routeProvider',
    '$locationProvider',
    'angularAuth0Provider',
    '$mdThemingProvider',
    '$httpProvider',
    'jwtOptionsProvider',
    '$translateProvider'
  ];

  function config(
      translations,
    $routeProvider,
    $locationProvider,
    angularAuth0Provider,
    $mdThemingProvider,
    $httpProvider,
    jwtOptionsProvider,
    $translateProvider
  ) {

      let fri3dGreen = $mdThemingProvider.extendPalette('cyan', {
          'contrastDefaultColor' : 'light',
          '500': '#0E98AF',
      });

      let fri3dOrange = $mdThemingProvider.extendPalette('deep-orange', {
          'contrastDefaultColor' : 'dark',
          '500': '#DD7222',
          'A200': '#DD7222',
      });

      // Register the new color palette map with the name <code>neonRed</code>
      $mdThemingProvider.definePalette('fri3dGreen', fri3dGreen);
      $mdThemingProvider.definePalette('fri3dOrange', fri3dOrange);

      // Use that theme for the primary intentions
      $mdThemingProvider.theme('cyan')
          .primaryPalette('fri3dGreen')
          .accentPalette('fri3dOrange');

      $mdThemingProvider.setDefaultTheme('cyan');

    $routeProvider
      .when('/callback', {
        controller: 'CallbackController',
        templateUrl: 'app/callback/callback.html',
        controllerAs: 'vm'
      })
      .when('/submission', {
          controller: 'SubmissionController',
          templateUrl: 'app/submissions/submission.html',
          controllerAs: 'vm',
          resolve: {
              comments: [function() { return {}; }],
              submission: [function() {
                  return emptySubmission();
              }],
              language: ['$location', function($location) {
                  return $location.hash() === 'en' ? 'en' : 'nl';
              }]
          }
      })
      .when('/submission/:id', {
          controller: 'SubmissionController',
          templateUrl: 'app/submissions/submission.html',
          controllerAs: 'vm',
          resolve: {
              comments: [ '$route', 'CommentsService', function($route, CommentsService) {
                  return CommentsService.list($route.current.params.id);
              }],
              submission: ['$route', 'SubmissionService', function($route, SubmissionService) {
                  if ($route.current.params.id) {
                      return SubmissionService.get($route.current.params.id);
                  } else {
                      return emptySubmission();
                  }
              }],
              language: ['$location', function($location) {
                  return $location.hash() === 'en' ? 'en' : 'nl';
              }]
          }
      })
      .when('/', {
          redirectTo: '/submission'
        // controller: 'HomeController',
        // templateUrl: 'app/home/home.html',
        // controllerAs: 'vm'
      })
      .otherwise({
        redirectTo: '/submission'
      });

      $mdThemingProvider.theme('default')
        .primaryPalette('blue-grey');

    // Initialization for the angular-auth0 library
    angularAuth0Provider.init({
      clientID: '1mrXgaecXFHbHtiaiXDk_xAoaSrm2483',
      domain: 'fri3d.eu.auth0.com',
      responseType: 'token id_token',
      audience: 'content.fri3d.be',
      redirectUri: 'http://localhost:3000/callback',
      scope: 'openid profile',
      leeway: 30
    });

    jwtOptionsProvider.config({
      tokenGetter: function() {
        return localStorage.getItem('access_token');
      },
      whiteListedDomains: ['localhost']
    });

    $httpProvider.interceptors.push('jwtInterceptor');

    $locationProvider.hashPrefix('');

    /// Comment out the line below to run the app
    // without HTML5 mode (will use hashes in routes)
    $locationProvider.html5Mode(true);

      let trans = {
          en: {},
          nl: {}
      };

      let untranslated = [];

      for (let k in translations) {
          if (! translations.hasOwnProperty(k)) continue;

          if (translations[k].length !== 0) untranslated.push(k);
          if (translations[k].length > 0) trans.nl[k] = translations[k][0];
          if (translations[k].length > 1) trans.en[k] = translations[k][1];
      }

      $translateProvider.translations('nl', trans.nl);
      $translateProvider.translations('en', trans.en);

      $translateProvider.preferredLanguage('nl');

      function emptySubmission() {
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
              session_count: 1,
              open_for_all: true,
              audience_level: [],
              open_for_repetitions: true,
              format: false,
              activity_duration: 60,
              visit_duration: 15
          };
      }

  }

})();
// vim: set expandtab:
