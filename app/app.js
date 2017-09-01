(function () {
  'use strict';

  angular
    .module('app', ['auth0.auth0', 'ngRoute', 'ngMaterial', 'angular-jwt', 'ngResource', 'ui.ace', 'base64', 'btford.socket-io', 'ng-showdown', 'pascalprecht.translate', 'angularMoment', 'WebStorageModule'])
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

     /* $mdThemingProvider.definePalette('fri3dPalette', {
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
      });*/

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
        'SUBMISSION_CAPTION': 'Fri3d Camp 2018: Call for participation',
        'SUBMISSION_DESC': 'TODO: toevoegen van beknopte CFP text cfr uitgestuurde text.',
        'ACTIVITY_TITLE': 'Your Fri3d activity',
        'ACTIVITY_DESC': 'Activiteiten op Fri3d Camp kunnen zeer uiteen lopend van aard zijn. We delen ze in in drie grote categorieën:',
        'BTN_SEND' : 'Verzenden',
        'TYPE_PRESENTATION': 'Presentation',
        'TYPE_PRESENTATION_DESC': 'Do you want to tell your story, and share your hacker passion with the other participants? Do you want to present your Open Source project? Then we have a fully equipped auditorium ready for you. The stage and all required support is present!',
        'TYPE_SELECT_PROMPT' : 'Choose one of the content types above to start filling out the rest of the form',
        'TYPE_WORKSHOP': 'Workshop',
        'TYPE_WORKSHOP_DESC': 'Will participants of your activity have to roll up their sleeves and get their hands dirty? Will you guide them from a vast nothing to a new creation of their own making? We are here to help you get that workshop on the road.',
        'TYPE_OTHER': 'Other',
        'TYPE_OTHER_DESC': 'Do you want to put up a piece of art on the terrain, or do you want to bring entertainment to our stage? Anything is possible. We have a very large camping ground with lots of possibilities and support for lots of activities.',
        'TITLE': 'Title of your activity',
        'TITLE_HINT': 'Hoe moeten we jouw activiteit etaleren?',
        'SUMMARY': 'Summary',
        'SUMMARY_HINT': 'Kan je een korte omschrijving geven van de activiteit?',
        'SPEAKER': 'Speaker',
        'NAME': 'Name',
        'EMAIL': 'E-Mail',
        'BIO_HINT': 'Welke informatie over jou is voor deelnemers interessant om in te schatten wat voor activiteit je organiseert?',
        'ASSOCIATED': 'Hacker- or makerspaces with which you are affiliated',
        'HACKERSPACES_HINT': 'Vul de hacker- en makerspaces in die je regelmatig bezoekt.',
        'AVAILABILITY': 'Wanneer ben je beschikbaar om deze activiteit te organiseren?',
        'DAY_ONE': 'Day 1 (Saturday, August 18)',
        'FROM': 'From',
        'UNTIL': 'Until',
        'DAY_TWO': 'Day 2 (Sunday, August 19)',
        'DAY_THREE': 'Day 3 (Monday, August 20)',
        'REPETITION_OPTION': 'Are you open to repeat this activity multiple times?',
        'AUDIENCE_TITLE': 'Publiek',
        'AUDIENCE_DESC': 'Fri3d Camp trekt een breed publiek aan. Daarom is het belangrijk dat je nu al in grote lijnen aangeeft voor welk publiek jouw activiteit geschikt is.',
        'FAMILY': 'Family',
        'EXPERT': 'Expert',
        'NOT_IN_LIST': 'None of the above',
        'AUDIENCE_REQUIREMENTS_LABEL': 'Are there specific expectations you have towards your audience?',
        'AUDIENCE_REQUIREMENTS_HINT': 'Certain knowledge or capabilities, materials to bring, ...',
        'LOCATION_TITLE': 'Locatie',
        'LOCATION_DESC': 'Heb je specifieke noden of materiaal nodig tijdens de workshop?',
        'LOCATION_LABEL': 'Requirements',
        'LOCATION_HINT': 'Vereisten qua plaats, benodigd materieel, extra helpers, ...',
        'LANGUAGE_SUPPORT_TITLE': 'Do you need dutch language support',
        'LANGUAGE_SUPPORT_DESC': '',
        'LANGUAGE_SUPPORT_OPTION': 'Need Dutch language support?',
        'CAPACITY_TITLE': 'Aantal deelnemers',
        'CAPACITY_DESC': 'Staat er een limiet op het aantal personen dat aan deze activiteit kan deelnemen?',
        'AMOUNT_AUDIENCE': 'Max. nr of participants',
        'SESSIONS_TITLE': 'Sessies',
        'SESSIONS_DESC': 'Een activiteit kan gespreid worden over verschillende sessies. Bijvoorbeeld een theoretische introductie, een praktische workshop en een <em>field trial</em>. Als dat voor jou activiteit het geval is, kan je dit hier aangeven.',
        'AMOUNT_SESSIONS': 'Number of sessions',
        'FORMAT_TITLE': 'Format',
        'FORMAT_DESC': 'Moeten deelnemers jouw activiteit van begin tot einde volgen, of kunnen ze doorlopend aansluiten?',
        'FULLTIME': 'Attendance from start to end',
        'WALK-IN': 'Walk-in attendance',
        'COLLABORATORS_TITLE': 'Medewerkers',
        'COLLABORATORS_DESC': 'Organiseer je deze activiteit samen met anderen? Dan kan je hun namen hier toevoegen.',
        'COLLABORATORS_ADD_BUTTON': 'Voeg een medewerker toe',
        'ACTIVITY_DURATION_TITLE': 'Hoe lang duurt je activiteit?',
        'ACTIVITY_DURATION_DESC': 'Hoe lang duurt deze activiteit in totaal, alle sessies inbegrepen, in minuten?',
        'ACTIVITY_DURATION_LABEL': 'Activity duration (in minutes)',
        'ACTIVITY_DURATION_PER_PARTICIPANT': 'Hoe lang duurt het voor één bezoeker om deel te nemen aan de activiteit?',
        'VISIT_DURATION_LABEL': 'How long does it take for one visitor to participate in the event?',
        'COSTS_TITLE': 'Costs',
        'COSTS_DESC': 'A note about costs, in €',
        'COSTS_LABEL': 'Kosten uitleg label',
        'GENERAL_REMARKS_TITLE': 'Remarks',
        'GENERAL_REMARKS_DESC': '',
        'GENERAL_REMARKS_HINT': 'Any special requirements, words of wisdom, ...',
        'SUBMISSION_COMPLETE_OPTION': 'My proposal is complete, let\'s go!',
        'SAVE': 'Save',
        'MESSAGE': 'Your message',
      });

      $translateProvider.translations('nl', {
        'SUBMISSION_CAPTION': 'Fri3d Camp 2018: Uitnodiging tot deelname',
        'SUBMISSION_DESC': 'TODO: toevoegen van beknopte CFP text cfr uitgestuurde text.',
        'ACTIVITY_TITLE': 'Jouw Fri3d activiteit',
        'ACTIVITY_DESC': 'Activiteiten op Fri3d Camp kunnen zeer uiteen lopend van aard zijn. We delen ze in in drie grote categorieën:',
        'BTN_SEND' : 'Send',
        'TYPE_PRESENTATION': 'Presentatie',
        'TYPE_PRESENTATION_DESC': 'Wil je het verhaal van jouw hacker passie delen met alle deelnemers, jouw Open Source project voorstellen,... Dan hebben wij een volledig uitgeruste zaal klaar staan. Het podium, en alle benodigde ondersteuning is aanwezig!',
        'TYPE_SELECT_PROMPT' : 'Kies één van de bovenstaande soorten content om de rest van het formulier in te vullen',
        'TYPE_WORKSHOP': 'Workshop',
        'TYPE_WORKSHOP_DESC': 'Kunnen en/of moeten de deelnemers aan jouw activteit zelf de handen uit de mouwen steken? Begeleid je hen gedurende jouw activiteit van niets tot hun volgende wonderlijke creatie, dan helpen we je graag deze workshop te realiseren.',
        'TYPE_OTHER': 'Andere',
        'TYPE_OTHER_DESC': 'Wil je kunstzinnig aan de slag gaan op het terrein, of wil je entertainment van de bovenste plank brengen? Ook dat kan allemaal. We hebben een groot terrein, en verschillende accomodaties ter beschikking.',
        'TITLE': 'Titel van je activiteit',
        'TITLE_HINT': 'Hoe moeten we jouw activiteit etaleren?',
        'SUMMARY': 'Samenvatting',
        'SUMMARY_HINT': 'Kan je een korte omschrijving geven van de activiteit?',
        'SPEAKER': 'Spreker',
        'NAME': 'Naam',
        'EMAIL': 'E-Mail Adres',
        'BIO_HINT': 'Welke informatie over jou is voor deelnemers interessant om in te schatten wat voor activiteit je organiseert?',
        'ASSOCIATED': 'Hacker- of makerspaces waar je bijhoort',
        'HACKERSPACES_HINT': 'Vul de hacker- en makerspaces in die je regelmatig bezoekt.',
        'AVAILABILITY': 'Wanneer ben je beschikbaar om deze activiteit te organizeren?',
        'DAY_ONE': 'Dag 1 (Zaterdag 18 augustus)',
        'FROM': 'Van',
        'UNTIL': 'Tot',
        'DAY_TWO': 'Dag 2 (Zondag 19 augustus)',
        'DAY_THREE': 'Dag 3 (Maandag 20 augustus)',
        'REPETITION_OPTION': 'Zou je deze activiteit meerdere keren willen organiseren tijdens het kamp?',
        'AUDIENCE_TITLE': 'Publiek',
        'AUDIENCE_DESC': 'Fri3d Camp trekt een breed publiek aan. Daarom is het belangrijk dat je nu al in grote lijnen aangeeft voor welk publiek jouw activiteit geschikt is.',
        'FAMILY': 'Familie',
        'EXPERT': 'Expert',
        'NOT_IN_LIST': 'Geen van bovenstaande opties',
        'AUDIENCE_REQUIREMENTS_LABEL': 'Zijn er specifieke verwachtingen die je hebt van je publiek?',
        'AUDIENCE_REQUIREMENTS_HINT': 'Bepaalde voorkennis of vaardigheden, mee te brengen materiaal, ...',
        'LOCATION_TITLE': 'Locatie',
        'LOCATION_DESC': 'Heb je specifieke noden of materiaal nodig tijdens de workshop?',
        'LOCATION_LABEL': 'Requirements',
        'LOCATION_HINT': 'Vereisten qua plaats, benodigd materieel, extra helpers, ...',
        'LANGUAGE_SUPPORT_TITLE': 'nvt',
        'LANGUAGE_SUPPORT_DESC': 'nvt',
        'LANGUAGE_SUPPORT_OPTION': 'nvt',
        'CAPACITY_TITLE': 'Aantal deelnemers',
        'CAPACITY_DESC': 'Staat er een limiet op het aantal personen dat aan deze activiteit kan deelnemen?',
        'AMOUNT_AUDIENCE': 'Max. aantal deelnemers',
        'SESSIONS_TITLE': 'Sessies',
        'SESSIONS_DESC': 'Een activiteit kan gespreid worden over verschillende sessies. Bijvoorbeeld een theoretische introductie, een praktische workshop en een <em>field trial</em>. Als dat voor jou activiteit het geval is, kan je dit hier aangeven.',
        'AMOUNT_SESSIONS': 'Aantal sessies',
        'FORMAT_TITLE': 'Format',
        'FORMAT_DESC': 'Moeten deelnemers jouw activiteit van begin tot einde volgen, of kunnen ze doorlopend aansluiten?',
        'FULLTIME': 'Aanwezigheid van begin tot einde',
        'WALK-IN': 'Doorlopende deelname',
        'COLLABORATORS_TITLE': 'Medewerkers',
        'COLLABORATORS_DESC': 'Organiseer je deze activiteit samen met anderen? Dan kan je hun namen hier toevoegen.',
        'COLLABORATORS_ADD_BUTTON': 'Voeg een medewerker toe',
        'ACTIVITY_DURATION_TITLE': 'Hoe lang duurt je activiteit?',
        'ACTIVITY_DURATION_DESC': 'Hoe lang duurt deze activiteit in totaal, alle sessies inbegrepen, in minuten?',
        'ACTIVITY_DURATION_LABEL': 'Activiteit duur (in minuten)',
        'ACTIVITY_DURATION_PER_PARTICIPANT': 'Hoe lang duurt het voor één bezoeker om deel te nemen aan de activiteit?',
        'VISIT_DURATION_LABEL': 'Hoe lang duurt het voor één bezoeker om deel te nemen aan de activiteit?',
        'COSTS_TITLE': 'Kosten',
        'COSTS_DESC': 'Kosten uitleg, in €',
        'COSTS_LABEL': 'Kosten uitleg label',
        'GENERAL_REMARKS_TITLE': 'Opmerkingen',
        'GENERAL_REMARKS_DESC': '',
        'GENERAL_REMARKS_HINT': 'Enige speciale vereisten, opmerkingen, ...',
        'SUBMISSION_COMPLETE_OPTION': 'Mijn voorstel is compleet, bekijken maar!',
        'SAVE': 'Bewaar',
        'MESSAGE': 'Jouw bericht',
      });

      $translateProvider.preferredLanguage('nl');

  }

})();
