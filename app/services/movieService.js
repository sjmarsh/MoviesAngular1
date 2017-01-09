app.service('movieService', ['$http', 'EnvironmentConfig',  function ($http, EnvironmentConfig) {
  
  var baseUrl = EnvironmentConfig.api + '/api/movies';

  this.getMovies = function(skip, take){
    var paging = '';
    if(skip && take){
      paging = '?skip=' + skip + '&take=' + take;
    }
    return $http.get(baseUrl + paging);
  };

  this.getMoviesByQuery = function (title, categories, skip, take) {
    var categoryList = '';
    if(categories && categories.length > 0)
    {
      for(var i = 0; i < categories.length; i ++){
        categoryList += '&categories='+ categories[i];
      }
    }
    var paging = '';
    if(skip && take){
      paging = '&skip=' + skip + '&take=' + take;
    }

    var query = baseUrl + '?searchFilter=' + title + categoryList + paging;
    
    return $http.get(query);
  };

  this.getMovie = function (movieId) {
    return $http.get(baseUrl + '/' + movieId);
  };

}])