'use strict';

angular.module('ng-app')

  .config([

    '$stateProvider',
    '$urlRouterProvider',

    function($stateProvider, $urlRouterProvider) {

      loadStates();

      //////////

      function loadStates() {

        $urlRouterProvider.otherwise('/');

        $stateProvider.state('home', {
          url: '/',
          views: {
            main: {
              templateUrl: 'home/home.template.html'
            }
          }

        });

      }

    }

  ]);