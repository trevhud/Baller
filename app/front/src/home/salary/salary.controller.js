'use strict';

angular.module('home')

  .controller(

    'Home.SalaryController',

    [

      '$scope',

      function($scope) {

        $scope.rates = 

          {
            'weekly': 40,
            'monthly': 173,
            'annual': 2080
          };

        }

    ]);