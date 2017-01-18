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
    .then(function success(movieResponse) {
      $scope.movieDetail = movieResponse.data;
    },
    function error(errorResponse) {
      var message = 'Error retrieving movie details.';
      if (errorResponse.data) {
        toastr.error(message + ' Error Message: ' + error.data);
      }
      else {
        toastr.error(message);
      }
    });
  };

}]);