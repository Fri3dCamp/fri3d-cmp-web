(function () {
  'use strict';

  angular
    .module('app', ['auth0.auth0', 'ngRoute', 'ngMaterial', 'angular-jwt', 'ngResource', 'ui.ace', 'base64', 'btford.socket-io', 'ng-showdown', 'pascalprecht.translate'])
    .config(config);

  config.$inject = [
    '$routeProvider',
    '$locationProvider',
    'angularAuth0Provider',
    '$mdThemingProvider',
    '$httpProvider',
    'jwtOptionsProvider',
      '$translateProvider'
  ];

  function config(
    $routeProvider,
    $locationProvider,
    angularAuth0Provider,
    $mdThemingProvider,
    $httpProvider,
    jwtOptionsProvider,
    $translateProvider
  ) {

      let fri3dMap = $mdThemingProvider.extendPalette('cyan', {
        '600': '#0E98AF'
      });

      // Register the new color palette map with the name <code>neonRed</code>
      $mdThemingProvider.definePalette('fri3d', fri3dMap);

      // Use that theme for the primary intentions
      $mdThemingProvider.theme('default')
          .primaryPalette('fri3d');

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
            submission: [function() {
              return {};
            }]
          }
      })
      .when('/submission/:id', {
          controller: 'SubmissionController',
          templateUrl: 'app/submissions/submission.html',
          controllerAs: 'vm',
          resolve: {
            submission: ['$route', 'SubmissionService', function($route, SubmissionService) {
              if ($route.current.params.id) {
                return SubmissionService.get($route.current.params.id);
              } else {
                return {
                    status: "IN_PREPARATION"
                };
              }
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

      $translateProvider.translations('en', {
          'GENERAL': 'General',
          'SPEAKER': 'Speaker',
          'COLLABORATORS': 'Collaborators',
          'ACTIVITY': 'Activity',
          'LOCATION': 'Location',
          'AUDIENCE': 'Audience',
          'WORKSHOP': 'Workshop',
          'TALK': 'Talk',
          'TITLE': 'Title of your activity',
          'FULLTIME': 'Attendance from start to end',
          'WALK-IN': 'Walk-in attendance',
          'SUBMISSION_TYPE': 'Type',
          'ATTENDANCE_TYPE': 'Format',
          'SUMMARY': 'Summary',
          'DESCRIPTION': 'Description',
          'INTENDED_AUDIENCE': 'Intended Audience',
          'NAME': 'Name',
          'EMAIL': 'E-Mail',
          'WILLING_TO_REPEAT': 'Are you willing to perform the same activity multiple times?',
          'FORMINTRO' : 'Submit your proposal for a talk, workshop or other activity on Fri3d Camp 2018.',
          'ASSOCIATED' : 'Hacker- or makerspaces with which you are affiliated',
          'REPEATS' : 'Maximum nr. of times you want to repeat your activity'
      });

      $translateProvider.translations('nl', {
          'GENERAL': 'Algemeen',
          'SPEAKER': 'Spreker',
          'COLLABORATORS': 'Medewerkers',
          'ACTIVITY': 'Activiteit',
          'LOCATION': 'Locatie',
          'AUDIENCE': 'Publiek',
          'WORKSHOP': 'Workshop',
          'TALK': 'Presentatie',
          'TITLE': 'Titel van je activiteit',
          'FULLTIME': 'Aanwezigheid van begin tot einde',
          'WALK-IN': 'Doorlopende deelname',
          'SUBMISSION_TYPE': 'Type',
          'ATTENDANCE_TYPE': 'Format',
          'SUMMARY': 'Samenvatting',
          'DESCRIPTION': 'Omschrijving',
          'INTENDED_AUDIENCE': 'Doelpubliek',
          'NAME': 'Naam',
          'EMAIL': 'E-Mail Adres',
          'WILLING_TO_REPEAT': 'Ben je bereid om deze activiteit meerdere keren uit te voeren?',
          'FORMINTRO' : 'Dien jouw voorstel in voor een talk, workshop of andere activiteit op Fri3d Camp 2018.',
          'ASSOCIATED' : 'Hacker- of makerspaces waar je bijhoort',
          'REPEATS' : 'Maximum aantal keren dat je je activiteit wil herhalen'
      });

      $translateProvider.preferredLanguage('nl');
  }

})();
