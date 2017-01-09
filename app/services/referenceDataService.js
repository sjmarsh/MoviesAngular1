app.service('referenceDataService', ['$http', 'EnvironmentConfig', function($http, EnvironmentConfig) {

  var baseUrl = EnvironmentConfig.api + '/api/referenceData';

  this.getCategories = function(){
    return $http.get(baseUrl + '/categories');
  }

}]);