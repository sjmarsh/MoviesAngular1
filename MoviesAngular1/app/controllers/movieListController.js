app.controller('movieListController', ['$scope', '$location', 'toastr' , 'movieService', function ($scope, $location, toastr, movieService) {

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
        var message = 'Error loading movies.';
        if (error) {
          toastr.error(message + ' Error: ' + error.message);
        }
        else {
          toastr.error(message);
        }
      })
  };

  function getMoviesByTitle() {
    if ($scope.searchFilter && $scope.searchFilter.length > 0) {
      movieService.getMoviesByTitle($scope.searchFilter)
      .success(function (movies) {
        $scope.movieList = movies;
      })
      .error(function (error) {
        var message = 'Error loading movies.';
        if (error) {
          toastr.error(message + ' Error: ' + error.message);
        }
        else {
          toastr.error(message);
        }
      })
    }
  };

}]);