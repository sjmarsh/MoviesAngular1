app.controller('movieListController', ['$scope', '$location', 'movieService', function ($scope, $location, movieService) {

  $scope.pageClass = 'page-movie-list';

  $scope.statusMessage = 'OK';
  $scope.movieList = [];

  getMovies();

  $scope.goToDetail = function (movieId) {
    var path ="/" + movieId;
    $location.path(path);
  };

  function getMovies() {
    movieService.getMovies()
      .success(function (movies) {
        $scope.movieList = movies;
      })
      .error(function (error) {
        $scope.statusMessage = 'Error loading movies. Error: ' + $scope.movieList;
      })
  };
}]);