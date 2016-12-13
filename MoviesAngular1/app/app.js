﻿var app = angular.module('MoviesApp', ['ngRoute', 'ngAnimate', 'toastr']);

app.config(['$routeProvider', function ($routeProvider) {

  $routeProvider
  .when('/', {
    templateUrl: 'views/page-movie-list.html',
    controller: 'movieListController'
  })

  .when('/:movieId', {
    templateUrl: 'views/page-movie-detail.html',
    controller: 'movieDetailController'
  })

  .otherwise({
    redirectTo: '/'
  })

}]);

app.filter('yesNo', function () {
  return function (input) {
    return input ? 'Yes' : 'No';
  };
});



