app.controller('movieListController', ['$scope', '$location', 'toastr', 'movieService', 'movieSearchService', 'referenceDataService', function ($scope, $location, toastr, movieService, movieSearchService, referenceDataService) {

  $scope.pageClass = 'page-movie-list';

  $scope.statusMessage = 'OK';

  $scope.searchFilter = "";
  $scope.movieList = [];

  $scope.selectedCategory = 'Category';
  $scope.categoryList = [];

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

  $scope.selectCategory = function($event, category){
    $event.stopPropagation();
    $event.preventDefault();

    console.log('Category: ' + category);
  }

  function initialize() {

    populateCategoryList();

    if (movieSearchService.getLastSearchFilter()) {
      $scope.searchFilter = movieSearchService.getLastSearchFilter();
    };

    getMovies();
  };

  function populateCategoryList() {
    referenceDataService.getCategories()
      .success(function(categories){
        $scope.categoryList = categories;
      })
      .error(function(error){
        var message = 'Error loading categories.';
        if (error) {
          toastr.error(message + ' Error: ' + error.message);
        }
        else {
          toastr.error(message);
        }
      });
  };

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