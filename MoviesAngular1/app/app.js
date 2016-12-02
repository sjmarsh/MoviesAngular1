var app = angular.module('MoviesApp', ['ngRoute', 'ngAnimate']);

app.config(function ($routeProvider) {

  $routeProvider
  .when('/', {
    templateUrl: 'app/views/page-movie-list.html',
    controller: 'movieListController'
  })

  .when('/:movieId', {
    templateUrl: 'app/views/page-movie-detail.html',
    controller: 'movieDetailController'
  })

  .otherwise({
    redirectTo: '/'
  })

});

app.filter('yesNo', function () {
  return function (input) {
    return input ? 'Yes' : 'No';
  };
});



