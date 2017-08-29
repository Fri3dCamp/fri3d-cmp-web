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


      let fri3dMap = $mdThemingProvider.extendPalette('cyan', {
          'contrastDefaultColor' : 'light',
          '500': '#0E98AF'
      });

      // Register the new color palette map with the name <code>neonRed</code>
      $mdThemingProvider.definePalette('fri3d', fri3dMap);

      // Use that theme for the primary intentions
      $mdThemingProvider.theme('cyan')
          .primaryPalette('fri3d');

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
                  return {
                      status: "IN_PREPARATION",
                      activity_participant_limit: 25,
                      day_1_from: 9,
                      day_1_until: 21,
                      day_2_from: 9,
                      day_2_until: 21,
                      day_3_from: 9,
                      day_3_until: 21,
                      costs: 0,
                      session_count: 1
                  };
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
                      return {
                          status: "IN_PREPARATION",
                          activity_participant_limit: 25,
                          day_1_from: 9,
                          day_1_until: 21,
                          day_2_from: 9,
                          day_2_until: 21,
                          day_3_from: 9,
                          day_3_until: 21,
                          costs: 0,
                          session_count: 1
                      };
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

      $translateProvider.translations('en', {
            'ACTIVITY': 'Activity',
            'ACTIVITY_FORMAT': 'Format',
            'ACTIVITY_TITLE': 'Your Fri3d activity',
            'AMOUNT_AUDIENCE': 'Max. nr of participants',
            'AMOUNT_REPEAT': 'Max. nr of times',
            'AMOUNT_SESSIONS': 'Number of sessions',
            'ASSOCIATED' : 'Hacker- or makerspaces with which you are affiliated',
            'AUDIENCE': 'Audience',
            'COLLABORATORS': 'Collaborators',
            'DAY_ONE': 'Day 1 (Saturday, August 18)',
            'DAY_THREE': 'Day 3 (Monday, August 20)',
            'DAY_TWO': 'Day 2 (Sunday, August 19)',
            'DESCRIPTION': 'Description',
            'EMAIL': 'E-Mail',
            'FORMINTRO' : 'Submit your proposal for a talk, workshop or other activity on Fri3d Camp 2018.',
            'FROM': 'From',
            'FULLTIME': 'Attendance from start to end',
            'GENERAL': 'General',
            'HAS_LIMIT': 'Limited',
            'HAS_SESSIONS': 'Multiple Sessions',
            'INTENDED_AUDIENCE': 'Intended Audience',
            'LOCATION': 'Preferred location',
            'MESSAGE': 'Your message',
            'NAME': 'Name',
            'NO': 'No',
            'NO_LIMIT': 'No Limit',
            'NO_SESSIONS': 'No Sessions',
            'REPEATS' : 'Maximum nr. of times you want to repeat your activity',
            'SPEAKER': 'Speaker',
            'SUBMISSION_CAPTION': 'Fri3d Camp 2018: Call for participation',
            'SUBMISSION_TYPE': 'Type',
            'SUMMARY': 'Summary',
            'TALK': 'Talk',
            'TITLE': 'Title of your activity',
            'TYPE_OTHER': 'Other',
            'TYPE_OTHER_DESC': 'Do you want to put up a piece of art on the terrain, or do you want to bring entertainment to our stage? Anything is possible. We have a very large camping ground with lots of possibilities and support for lots of activities.',
            'TYPE_PRESENTATION': 'Presentation',
            'TYPE_PRESENTATION_DESC': 'Do you want to tell your story, and share your hacker passion with the other participants? Do you want to present your Open Source project? Then we have a fully equipped auditorium ready for you. The stage and all required support is present!',
            'TYPE_WORKSHOP': 'Workshop',
            'TYPE_WORKSHOP_DESC': 'Will participants of your activity have to roll up their sleeves and get their hands dirty? Will you guide them from a vast nothing to a new creation of their own making? We are here to help you get that workshop on the road.',
            'UNTIL': 'Until',
            'WALK-IN': 'Walk-in attendance',
            'WILLING_TO_REPEAT': 'Are you willing to perform the same activity multiple times?',
            'WORKSHOP': 'Workshop',
            'YES': 'Yes',
            'LANGUAGE_SUPPORT_TITLE': 'Do you need dutch language support',
            'LANGUAGE_SUPPORT_DESC': '',
            'LANGUAGE_SUPPORT_OPTION': 'Need Dutch language support?',
            'REPETITION_OPTION': 'Are you open to repeat this activity multiple times?',
            'FAMILY': 'Family',
            'EXPERT': 'Expert',
            'NOT_IN_LIST': 'None of the above',
            'GENERAL_REMARKS_TITLE': 'Remarks',
            'GENERAL_REMARKS_DESC': '',
            'GENERAL_REMARKS_HINT' : 'Any special requirements, words of wisdom, ...',
            'COSTS_TITLE': 'Costs',
            'COSTS_DESC': 'A note about costs',
            'SUBMISSION_COMPLETE_OPTION' :'My proposal is complete, let\'s go!',
          'SAVE' :'Save',
          'AUDIENCE_REQUIREMENTS_LABEL' :'Are there specific expectations you have towards your audience?',
          'AUDIENCE_REQUIREMENTS_HINT' :'Certain knowledge or capabilities, materials to bring, ...',
      });

      $translateProvider.translations('nl', {
          'ACTIVITY': 'Activiteit',
          'ACTIVITY_FORMAT': 'Format',
          'ACTIVITY_TITLE': 'Jouw Fri3d activiteit',
          'AMOUNT_AUDIENCE': 'Max. aantal deelnemers',
          'AMOUNT_REPEAT': 'Max. aantal keren',
          'AMOUNT_SESSIONS': 'Aantal sessies',
          'ASSOCIATED' : 'Hacker- of makerspaces waar je bijhoort',
          'AUDIENCE': 'Publiek',
          'COLLABORATORS': 'Medewerkers',
          'DAY_ONE': 'Dag 1 (Zaterdag 18 augustus)',
          'DAY_THREE': 'Dag 3 (Maandag 20 augustus)',
          'DAY_TWO': 'Dag 2 (Zondag 19 augustus)',
          'DESCRIPTION': 'Omschrijving',
          'EMAIL': 'E-Mail Adres',
          'FORMINTRO' : 'Dien jouw voorstel in voor een talk, workshop of andere activiteit op Fri3d Camp 2018.',
          'FROM': 'Van',
          'FULLTIME': 'Aanwezigheid van begin tot einde',
          'GENERAL': 'Algemeen',
          'HAS_LIMIT': 'Gelimiteerd',
          'HAS_SESSIONS': 'Meerdere Sessies',
          'INTENDED_AUDIENCE': 'Doelpubliek',
          'LOCATION': 'Waar zou je de activiteit graag willen laten doorgaan?',
          'MESSAGE': 'Jouw bericht',
          'NAME': 'Naam',
          'NO_LIMIT': 'Geen limiet',
          'NO_SESSIONS': 'Geen Sessies',
          'NO': 'Nee',
          'REPEATS' : 'Maximum aantal keren dat je je activiteit wil herhalen',
          'SPEAKER': 'Spreker',
          'SUBMISSION_CAPTION': 'Fri3d Camp 2018: Uitnodiging tot deelname',
          'SUBMISSION_TYPE': 'Type',
          'SUMMARY': 'Samenvatting',
          'TALK': 'Presentatie',
          'TITLE': 'Titel van je activiteit',
          'TYPE_OTHER_DESC': 'Wil je kunstzinnig aan de slag gaan op het terrein, of wil je entertainment van de bovenste plank brengen? Ook dat kan allemaal. We hebben een groot terrein, en verschillende accomodaties ter beschikking.',
          'TYPE_OTHER': 'Andere',
          'TYPE_PRESENTATION_DESC': 'Wil je het verhaal van jouw hacker passie delen met alle deelnemers, jouw Open Source project voorstellen,... Dan hebben wij een volledig uitgeruste zaal klaar staan. Het podium, en alle benodigde ondersteuning is aanwezig!',
          'TYPE_PRESENTATION': 'Presentatie',
          'TYPE_WORKSHOP_DESC': 'Kunnen en/of moeten de deelnemers aan jouw activteit zelf de handen uit de mouwen steken? Begeleid je hen gedurende jouw activiteit van niets tot hun volgende wonderlijke creatie, dan helpen we je graag deze workshop te realiseren.',
          'TYPE_WORKSHOP': 'Workshop',
          'UNTIL': 'Tot',
          'WALK-IN': 'Doorlopende deelname',
          'WILLING_TO_REPEAT': 'Ben je bereid om deze activiteit meerdere keren uit te voeren?',
          'YES': 'Ja',
          'LANGUAGE_SUPPORT_TITLE': 'nvt',
          'LANGUAGE_SUPPORT_DESC': 'nvt',
          'LANGUAGE_SUPPORT_OPTION': 'nvt',
          'REPETITION_OPTION': 'Zou je deze activiteit meerdere keren willen organiseren tijdens het kamp?',
          'FAMILY': 'Familie',
          'EXPERT': 'Expert',
          'NOT_IN_LIST': 'Geen van bovenstaande opties',
          'GENERAL_REMARKS_TITLE': 'Opmerkingen',
          'GENERAL_REMARKS_DESC': '',
          'GENERAL_REMARKS_HINT' : 'Enige speciale vereisten, opmerkingen, ...',
          'COSTS_TITLE': 'Kosten',
          'COSTS_DESC': 'Kosten uitleg',
          'SUBMISSION_COMPLETE_OPTION' :'Mijn voorstel is compleet, bekijken maar!',
          'SAVE' :'Bewaar',
          'AUDIENCE_REQUIREMENTS_LABEL' :'Zijn er specifieke verwachtingen die je hebt van je publiek?',
          'AUDIENCE_REQUIREMENTS_HINT' :'Bepaalde voorkennis of vaardigheden, mee te brengen materiaal, ...',
      });

      $translateProvider.preferredLanguage('nl');
  }

})();
