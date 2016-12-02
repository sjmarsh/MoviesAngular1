app.service('movieService', ['$http', function ($http) {
  
  // TODO: config for base url
  var baseUrl = 'http://localhost:5000' + '/api/movies';

  this.getMovies = function(){
    return $http.get(baseUrl);
  };

  this.getMovie = function (movieId) {
    return $http.get(baseUrl + '/' + movieId);
  };

}])