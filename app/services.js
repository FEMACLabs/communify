'use strict';

angular.module('capstoneApp.services', [])

.service('signinService', ['$http', function($http) {
  return {
    submitSignin: function(user) {
      return $http.post('http://localhost:3000/signin', user)
      .then(function(response) {
        return response;
      }, function(error) {
        // console.log('service errors');
        return error;
      });
    }
  };
}])

.service('signupService', ['$http', function($http) {
  return {
    submitSignup: function(user) {
      return $http.post('http://localhost:3000/signup', user)
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

.service('getUserService', ['$http', function($http) {

    this.all = function(user) {
      var userID = localStorage.getItem('id');
      return $http.get('http://localhost:3000/users/' + userID, user)
      .then(function(response) {
        // console.log('success response');
        return response;
      }, function(error) {
        // console.log('service errors');
        return error;
      });

  };
}])

.service('putUserService', ['$http', function($http) {
  return {
    submitProfile: function(user) {
      var userID = localStorage.getItem('id');
      console.log(user);
      return $http.put('http://localhost:3000/users/' + userID, user)
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
      var userID = localStorage.getItem('id');
      return $http.post('http://localhost:3000/users/' + userID + '/events', anEvent)
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

.service('removeRsvpService', ['$http', function($http) {
  return {
    removersvp: function(anEvent) {
      var userID = localStorage.getItem('id');
      return $http.delete('http://localhost:3000/users/' + userID + '/events/' + anEvent.id, anEvent)
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

.service('zipFilterService', ['$http', function($http) {
  return {
    zipFilter: function(miles) {
      return $http.get('https://www.zipcodeapi.com/rest/Ld7VZyffImDkZc5HoWceba1XZRCzzl8lzggzOwOxTsSSEXz2TLg5Wi3VaFvK1E5A/radius.json/{{user.zip}}/{{zipFilter.distance}}/mile')
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

.service('AuthInterceptor', function($location, $q) {
  return {
    request: function(config) {
      // prevent browser bar tampering for /api routes
      config.headers['X-Requested-With'] = 'XMLHttpRequest';
      var token = localStorage.getItem("Authorization");
      if (token) {
        config.headers.Authorization = token;
      }
        return $q.resolve(config);
    },
    responseError: function(err) {
      // if token is tampered with, log out user and destroy token
      if (err.data === "invalid token" || err.data === "invalid signature" || err.data === "jwt malformed") {
        $location.path('/');
        return $q.reject(err);
      }
      // reject access to other users
      if (err.status === 401) {
        $location.path('/');
        return $q.reject(err);
      }
      return $q.reject(err);
    }
  };
});
