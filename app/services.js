'use strict';

angular.module('capstoneApp')

.service('dataService', ['$http', function($http) {

  var self = {};

  self.get = function(){
    return $http.get('http://localhost:3000/users');
  };

  return self;
}])

.service('postUserService', ['$http', function($http) {
  return {
    submitProfile: function(user) {
      return $http.post('http://localhost:3000/users', user)
        .then(function(response) {
          // console.log('success response');
          return response;
        }, function(error) {
          // console.log('service errors');
          return error;
      });
    }
  };
}])

.service('postEventService', ['$http', function($http) {
  return {
    submitEvent: function(anEvent) {
      return $http.post('http://localhost:3000/events', anEvent)
        .then(function(response) {
          // console.log('success response');
          return response;
        }, function(error) {
          // console.log('service errors');
          return error;
      });
    }
  };
}]);
