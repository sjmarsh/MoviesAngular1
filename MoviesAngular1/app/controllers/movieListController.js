app.controller('movieListController', ['$scope', '$location', 'movieService', function ($scope, $location, movieService) {

  $scope.pageClass = 'page-movie-list';

  $scope.statusMessage = 'OK';

  $scope.searchFilter = "";
  $scope.movieList = [];

  getMovies();

  $scope.goToDetail = function (movieId) {
    var path ="/" + movieId;
    $location.path(path);
  };

  $scope.searchKeyPress = function (event) {
    var ENTER = 13;
    if (event && event.keyCode === ENTER) {
      getMoviesByTitle();
    }
  }

  $scope.search = function () {
    getMoviesByTitle();
  }

  function getMovies() {
    movieService.getMovies()
      .success(function (movies) {
        $scope.movieList = movies;
      })
      .error(function (error) {
        $scope.statusMessage = 'Error loading movies. Error: ' + error.message;
      })
  };

  function getMoviesByTitle() {
    if ($scope.searchFilter && $scope.searchFilter.length > 0) {
      movieService.getMoviesByTitle($scope.searchFilter)
      .success(function (movies) {
        $scope.movieList = movies;
      })
      .error(function (error) {
        $scope.statusMessage = 'Error loading movies. Error: ' + error.message;
      })
    }
  };

}]);