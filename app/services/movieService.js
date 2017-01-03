app.service('movieService', ['$http', function ($http) {
  
  // TODO: config for base url
  // local dev
  var baseUrl = 'http://localhost:5000' + '/api/movies';
  // ext
  //var baseUrl = 'http://moviesbeanstalk.yxmdgbxk2b.ap-southeast-2.elasticbeanstalk.com/api/movies'

  this.getMovies = function(){
    return $http.get(baseUrl);
  };

  this.getMoviesByQuery = function (title, categories) {
    var categoryList = '';
    if(categories && categories.length > 0)
    {
      for(var i = 0; i < categories.length; i ++){
        categoryList += '&categories='+ categories[i];
      }
    }
    var query = baseUrl + '?searchFilter=' + title + categoryList;
    
    return $http.get(query);
  };

  this.getMovie = function (movieId) {
    return $http.get(baseUrl + '/' + movieId);
  };

}])