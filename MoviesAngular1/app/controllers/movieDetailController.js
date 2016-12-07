app.controller('movieDetailController', ['$scope', '$location', '$routeParams', 'toastr', 'movieService', function ($scope, $location, $routeParams, toastr, movieService) {

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
      var message = 'Error retrieving movie details.';
      if (error) {
        toastr.error(message + ' Error Message: ' + error.message);
      }
      else {
        toastr.error(message);
      }
    });
  };

}]);