app.service('referenceDataService', ['$http', function($http){

  //TODO configure
  var baseUrl = 'http://moviesbeanstalk.yxmdgbxk2b.ap-southeast-2.elasticbeanstalk.com/api/referenceData'

  this.getCategories = function(){
    return $http.get(baseUrl + '/categories');
  }

}]);