(function () {
  'use strict';

  angular
    .module('app', ['auth0.auth0', 'ngRoute', 'ngMaterial', 'angular-jwt', 'ngResource', 'ui.ace', 'base64', 'btford.socket-io', 'ng-showdown', 'pascalprecht.translate', 'angularMoment'])
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

      $mdThemingProvider.definePalette('fri3dPalette', {
            '50': 'ff0000',
            '100': 'ff0000',
            '200': 'ff0000',
            '300': 'ff0000',
            '400': 'ff0000',
            '500': 'ff0000',
            '600': 'ff0000',
            '700': 'ff0000',
            '800': 'ff0000',
            '900': 'ff0000',
            'A100': 'ff0000',
            'A200': 'ff0000',
            'A400': 'ff0000',
            'A700': 'ff0000',
            'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                                // on this palette should be dark or light

            'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
             '200', '300', '400', 'A100'],
            'contrastLightColors': undefined    // could also specify this if default was 'dark'
      });


      //let fri3dMap = $mdThemingProvider.extendPalette('cyan', {
      //    '600': '#0E98AF'
      //});

      // Register the new color palette map with the name <code>neonRed</code>
      //$mdThemingProvider.definePalette('fri3d', fri3dMap);

      // Use that theme for the primary intentions
      $mdThemingProvider.theme('default')
          .primaryPalette('fri3dPalette');

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
              submission: [function() { return {}; }]
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
          'ACTIVITY_FORMAT': 'Format',
          'SUMMARY': 'Summary',
          'DESCRIPTION': 'Description',
          'INTENDED_AUDIENCE': 'Intended Audience',
          'NAME': 'Name',
          'EMAIL': 'E-Mail',
          'WILLING_TO_REPEAT': 'Are you willing to perform the same activity multiple times?',
          'FORMINTRO' : 'Submit your proposal for a talk, workshop or other activity on Fri3d Camp 2018.',
          'ASSOCIATED' : 'Hacker- or makerspaces with which you are affiliated',
          'REPEATS' : 'Maximum nr. of times you want to repeat your activity',
          'MESSAGE': 'Your message'
      });

      $translateProvider.translations('nl', {
          'SUBMISSION_CAPTION': 'Fri3d Camp 2018: Uitnodiging tot deelname',
          'ACTIVITY_TITLE': 'Jouw Fri3d activiteit',
          'TYPE_PRESENTATION': 'Presentatie',
          'TYPE_PRESENTATION_DESC': 'Wil je het verhaal van jouw hacker passie delen met alle deelnemers, jouw Open Source project voorstellen,... Dan hebben wij een volledig uitgeruste zaal klaar staan. Het podium, en alle benodigde ondersteuning is aanwezig!',
          'TYPE_WORKSHOP': 'Workshop',
          'TYPE_WORKSHOP_DESC': 'Kunnen en/of moeten de deelnemers aan jouw activteit zelf de handen uit de mouwen steken? Begeleid je hen gedurende jouw activiteit van niets tot hun volgende wonderlijke creatie, dan helpen we je graag deze workshop te realiseren.',
          'TYPE_OTHER': 'Andere',
          'TYPE_OTHER_DESC': 'Wil je kunstzinnig aan de slag gaan op het terrein, of wil je entertainment van de bovenste plank brengen? Ook dat kan allemaal. We hebben een groot terrein, en verschillende accomodaties ter beschikking.',

          'DAY_ONE': 'Dag 1',
          'DAY_TWO': 'Dag 2',
          'DAY_THREE': 'Dag 3',
          'FROM': 'Van',
          'UNTIL': 'Tot',

          'NO_SESSIONS': 'Geen Sessies',
          'HAS_SESSIONS': 'Meerdere Sessies',
          'AMOUNT': 'Aantal',

          'NO_LIMIT': 'Geen limiet',
          'HAS_LIMIT': 'Gelimiteerd',

          'YES': 'Ja',
          'NO': 'Nee',


          'GENERAL': 'Algemeen',
          'SPEAKER': 'Spreker',
          'COLLABORATORS': 'Medewerkers',
          'ACTIVITY': 'Activiteit',
          'LOCATION': 'Locatie',
          'AUDIENCE': 'Publiek',
          'TALK': 'Presentatie',
          'TITLE': 'Titel van je activiteit',
          'FULLTIME': 'Aanwezigheid van begin tot einde',
          'WALK-IN': 'Doorlopende deelname',
          'SUBMISSION_TYPE': 'Type',
          'ACTIVITY_FORMAT': 'Format',
          'SUMMARY': 'Samenvatting',
          'DESCRIPTION': 'Omschrijving',
          'INTENDED_AUDIENCE': 'Doelpubliek',
          'NAME': 'Naam',
          'EMAIL': 'E-Mail Adres',
          'WILLING_TO_REPEAT': 'Ben je bereid om deze activiteit meerdere keren uit te voeren?',
          'FORMINTRO' : 'Dien jouw voorstel in voor een talk, workshop of andere activiteit op Fri3d Camp 2018.',
          'ASSOCIATED' : 'Hacker- of makerspaces waar je bijhoort',
          'REPEATS' : 'Maximum aantal keren dat je je activiteit wil herhalen',
          'MESSAGE': 'Jouw bericht'
      });

      $translateProvider.preferredLanguage('nl');
  }

})();
