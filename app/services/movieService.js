app.service('movieService', ['$http', function ($http) {
  
  // TODO: config for base url
  // local dev
  //var baseUrl = 'http://localhost:5000' + '/api/movies';
  // ext
  var baseUrl = 'http://moviesbeanstalk.yxmdgbxk2b.ap-southeast-2.elasticbeanstalk.com/api/movies'

  this.getMovies = function(){
    return $http.get(baseUrl);
  };

  this.getMoviesByQuery = function (title, category) {
    return $http.get(baseUrl + '?searchFilter=' + title + '&category=' + category)
  };

  this.getMovie = function (movieId) {
    return $http.get(baseUrl + '/' + movieId);
  };

}])