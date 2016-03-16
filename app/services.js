'use strict';

angular.module('capstoneApp')

.service('getUserService', ['$http', function($http) {

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

.service('getEventService', ['$http', function($http) {
    this.all = function() {
      return $http({
        method: 'GET',
        url: 'http://localhost:3000/events'
      }).then(function(events) {
        console.log(events);
        return events;
      }, function(response) {
        console.error(new Error(response));
      });
    };
    // this.remove = function(dream) {
    //   dreams.splice(dreams.indexOf(dream), 1);
    // };
    // this.get = function(dreamId) {
    //   for (var i = 0; i < dreams.length; i++) {
    //     if (dreams[i].id === parseInt(dreamId)) {
    //       return dreams[i];
    //     }
    //   }
    //   return null;
    // };
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
}])

.service('rsvpService', ['$http', function($http) {
  return {
    rsvp: function(anEvent) {
      return $http.post('http://localhost:3000//users/:id/events', anEvent)
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
