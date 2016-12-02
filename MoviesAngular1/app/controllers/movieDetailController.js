app.controller('movieDetailController', ['$scope', '$location', '$routeParams', 'movieService', function ($scope, $location, $routeParams,  movieService) {

  $scope.pageClass = 'page-movie-detail';

  $scope.movieDetail = {};

  getMovie();

  $scope.backToList = function () {
    $location.path('/');
  }

  function getMovie() {
    var movieId = $routeParams.movieId;
    movieService.getMovie(movieId)
    .success(function (movie) {
      $scope.movieDetail = movie;
    })
    .error(function (error) {
      $scope.status = 'Error retrieving movie details. Error Message: ' + error.message;
    });
  };

}]);