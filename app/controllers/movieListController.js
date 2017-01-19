app.controller('movieListController', ['$scope', '$location', 'toastr', 'movieService', 'movieSearchService', 'referenceDataService', function ($scope, $location, toastr, movieService, movieSearchService, referenceDataService) {

  $scope.pageClass = 'page-movie-list';

  $scope.statusMessage = 'OK';

  $scope.shouldDisableGetMoreMovies = false;
  $scope.gettingMovies = false;

  $scope.isSearchPanelVisible;
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
  };

  $scope.search = function () {
    searchForMovies();
  };

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
      movieSearchService.storeLastSelectedCategories($scope.selectedCategories);
    }
  };

  $scope.removeCategorySelection = function(category){
    // nb. indexOf not supported in older browsers
    var index = $scope.selectedCategories.indexOf(category);
    if(index > -1){
      $scope.selectedCategories.splice(index, 1);
      movieSearchService.storeLastSelectedCategories($scope.selectedCategories);
    }
  };

  $scope.toggleSearchPanel = function(){
    if(movieSearchService.isSearchPanelVisible()){
      movieSearchService.hideSearchPanel();
      $scope.isSearchPanelVisible = movieSearchService.isSearchPanelVisible();
    }
    else{
      movieSearchService.showSearchPanel();
      $scope.isSearchPanelVisible = movieSearchService.isSearchPanelVisible();
    }
  };

  $scope.getMoreMovies = function(){
    var skip = movieSearchService.nextPageSkip();
    var take = movieSearchService.nextPageTakeSize();

    if(movieSearchService.hasMorePages()){
      updateGetMoreMovieStatus(true);
      movieService.getMoviesByQuery($scope.searchFilter, $scope.selectedCategories, skip, take)
        .then(function success(movieResponse){
          var movies = movieResponse.data.movies;
          for(var i = 0; i < movies.length; i++)
          {
            $scope.movieList.push(movies[i]);
          }
          updateGetMoreMovieStatus(false);
          movieSearchService.incrementPage();
        },
        function error(errorResponse){
          updateGetMoreMovieStatus(false);
          var message = 'Error getting more movies.';
          if (errorResponse.data) {
            toastr.error(message + ' Error: ' + errorResponse.data);
          }
          else {
            toastr.error(message);
          }
        });      
      }
  };

  function initialize() {
    populateCategoryList();
   
    if (movieSearchService.getLastSearchFilter()) {
      $scope.searchFilter = movieSearchService.getLastSearchFilter();
    };
    
    $scope.selectedCategories = movieSearchService.getLastSelectedCategories();

    $scope.isSearchPanelVisible = movieSearchService.isSearchPanelVisible();

    getMovies();
  };

  function populateCategoryList() {
    referenceDataService.getCategories()
      .then(function success(categoriesResponse){
        $scope.categoryList = categoriesResponse.data;
      },function error(errorResponse){
        var message = 'Error loading categories.';
        if (errorResponse.data) {
          toastr.error(message + ' Error: ' + errorResponse.data);
        }
        else {
          toastr.error(message);
        }
      });
  };

  function getMovies() {
    if (movieSearchService.hasStoredResults()) {
      $scope.movieList = movieSearchService.getStoredResults().movies;
    }
    else {
      updateGetMoreMovieStatus(true);
      movieService.getMovies()
      .then(function success(movieResponse) {
        $scope.movieList = movieResponse.data.movies;
        movieSearchService.storeResults(movieResponse.data);
        updateGetMoreMovieStatus(false);
      }, function error(errorResponse) {
        updateGetMoreMovieStatus(false);
        var message = 'Error loading movies.';
        if (errorResponse.data) {
          toastr.error(message + ' Error: ' + errorResponse.data);
        }
        else {
          toastr.error(message);
        }
      })
    }
  };

  function searchForMovies() {
    updateGetMoreMovieStatus(true);
    movieSearchService.storeLastSearchFilter($scope.searchFilter);
    movieSearchService.resetCurrentPage();
    
    movieService.getMoviesByQuery($scope.searchFilter, $scope.selectedCategories)
    .then(function (movieResponse) {
      $scope.movieList = movieResponse.data.movies;
      movieSearchService.storeResults(movieResponse.data);
      updateGetMoreMovieStatus(false);
    },function error(errorResponse) {
      updateGetMoreMovieStatus(false);
      var message = 'Error loading movies.';
      if (errorResponse.data) {
        toastr.error(message + ' Error: ' + errorResponse.data);
      }
      else {
        toastr.error(message);
      }
    }); 
  };

  function updateGetMoreMovieStatus(gettingMovies){
    $scope.gettingMovies = gettingMovies;
    $scope.shouldDisableGetMoreMovies = $scope.gettingMovies || !movieSearchService.hasMorePages;
  }

}]);