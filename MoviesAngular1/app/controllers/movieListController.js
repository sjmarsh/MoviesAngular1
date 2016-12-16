app.controller('movieListController', ['$scope', '$location', 'toastr' , 'movieService', 'movieSearchService', function ($scope, $location, toastr, movieService, movieSearchService) {

  $scope.pageClass = 'page-movie-list';

  $scope.statusMessage = 'OK';

  $scope.searchFilter = "";
  $scope.movieList = [];

  initialize();
  
  $scope.goToDetail = function (movieId) {
    var path ="/" + movieId;
    $location.path(path);
  };

  $scope.searchKeyPress = function (event) {
    var ENTER = 13;
    if (event && event.keyCode === ENTER) {
      getMoviesByTitle();
      event.target.blur();
    }
  }

  $scope.search = function () {
    getMoviesByTitle();
  }

  function initialize() {
    if (movieSearchService.getLastSearchFilter()) {
      $scope.searchFilter = movieSearchService.getLastSearchFilter();
    };

    getMovies();
  }

  function getMovies() {

    if (movieSearchService.hasStoredResults()) {
      $scope.movieList = movieSearchService.getStoredResults();
    }
    else {
      movieService.getMovies()
      .success(function (movies) {
        $scope.movieList = movies;
        movieSearchService.storeResults(movies);
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

  function getMoviesByTitle() {

    movieSearchService.storeLastSearchFilter($scope.searchFilter);

    if ($scope.searchFilter && $scope.searchFilter.length > 0) {
      movieService.getMoviesByTitle($scope.searchFilter)
      .success(function (movies) {
        $scope.movieList = movies;
        movieSearchService.storeResults(movies);
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
    else {
      $scope.movieList = [];
      movieSearchService.storeResults([]);
    }
  };

}]);