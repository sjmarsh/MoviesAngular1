app.controller('movieListController', ['$scope', '$location', 'toastr', 'movieService', 'movieSearchService', 'referenceDataService', function ($scope, $location, toastr, movieService, movieSearchService, referenceDataService) {

  $scope.pageClass = 'page-movie-list';

  $scope.statusMessage = 'OK';

  $scope.searchFilter = "";
  $scope.movieList = [];

  $scope.selectedCategory = 'Category';
  $scope.selectedCategories = [];
  $scope.categoryList = [];

  initialize();
  
  $scope.goToDetail = function (movieId) {
    var path ="/" + movieId;
    $location.path(path);
  };

  $scope.searchKeyPress = function (event) {
    var ENTER = 13;
    if (event && event.keyCode === ENTER) {
      searchForMovies();
      event.target.blur();
    }
  }

  $scope.search = function () {
    searchForMovies();
  }

  $scope.selectCategory = function($event, category){
    $event.stopPropagation();
    $event.preventDefault();

    $scope.selectedCategory = category;
    var index = $scope.selectedCategories.indexOf(category);
    if(index > -1){
      // already added
    }
    else{
      $scope.selectedCategories.push(category);
    }
    
  }

  $scope.removeCategorySelection = function(category){
    // nb. indexOf not supported in older browsers
    var index = $scope.selectedCategories.indexOf(category);
    if(index > -1){
      $scope.selectedCategories.splice(index, 1);
    }
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

  function searchForMovies() {

    movieSearchService.storeLastSearchFilter($scope.searchFilter);
    
    movieService.getMoviesByQuery($scope.searchFilter, $scope.selectedCategory)
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
    });
    
  };

}]);