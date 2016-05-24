'use strict';

function dbURL() {
  return {
    url: "https://communifyapp.herokuapp.com"
  };
}

angular.module('communifyApp.services', [])

.service('dbURL', dbURL)

.service('signinService', ['$http', 'dbURL', function($http, dbURL) {
  return {
    submitSignin: function(user) {
      return $http.post(dbURL.url + '/signin', user)
      .then(function(response) {
        return response;
      }, function(error) {
        // console.log('service errors');
        return error;
      });
    }
  };
}])

.service('signupService', ['$http', 'dbURL', function($http, dbURL) {
  return {
    submitSignup: function(user) {
      return $http.post(dbURL.url + '/signup', user)
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

.service('getUserService', ['$http', 'dbURL', function($http, dbURL) {

    this.all = function(user) {
      var userID = localStorage.getItem('id');
      return $http.get(dbURL.url + '/users/' + userID, user)
      .then(function(response) {
        // console.log('success response');
        return response;
      }, function(error) {
        // console.log('service errors');
        return error;
      });

  };
}])

.service('putUserService', ['$http', 'dbURL', function($http, dbURL) {
  return {
    submitProfile: function(user) {
      var userID = localStorage.getItem('id');
      console.log(user);
      return $http.put(dbURL.url + '/users/' + userID, user)
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

.service('getEventService', ['$http', 'dbURL', function($http, dbURL) {
    this.all = function() {
      return $http({
        method: 'GET',
        url: dbURL.url + '/events'
      }).then(function(events) {
        return events;
      }, function(response) {
        console.error(new Error(response));
      });
    };
  }])

  .service('getOneEventService', [function() {
    return {
      // getOneEvent: function(thisEvent) {
      //   return $http.get('http://localhost:3000/events/' + thisEvent.id)
      //   .then(function(response) {
      //     // console.log('success response');
      //     return response;
      //   }, function(error) {
      //     // console.log('service errors');
      //     return error;
      //   });
      // }
    };
  }])

.service('postEventService', ['$http', 'dbURL', function($http, dbURL) {
  return {
    submitEvent: function(anEvent) {
      var userID = localStorage.getItem('id');
      anEvent.owner_id = userID;
      return $http.post(dbURL.url + '/events', anEvent)
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

.service('putEventService', ['$http', 'dbURL', function($http, dbURL) {
  return {
    submitEditEvent: function(thisEvent) {
      console.log(thisEvent);
      // var userID = localStorage.getItem('id');
      return $http.put(dbURL.url + '/events/' + thisEvent.id, thisEvent)
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

.service('deleteEventService', ['$http', 'dbURL', function($http, dbURL) {
  return {
    deleteEvent: function(thisEvent) {
      console.log(thisEvent);
      // var userID = localStorage.getItem('id');
      return $http.delete(dbURL.url + '/events/' + thisEvent.id, thisEvent)
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

.service('rsvpService', ['$http', 'dbURL', function($http, dbURL) {
  return {
    rsvp: function(anEvent) {
      var userID = localStorage.getItem('id');
      return $http.post(dbURL.url + '/users/' + userID + '/events', anEvent)
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

.service('removeRsvpService', ['$http', 'dbURL', function($http, dbURL) {
  return {
    removersvp: function(anEvent) {
      var userID = localStorage.getItem('id');
      return $http.delete(dbURL.url + '/users/' + userID + '/events/' + anEvent.id, anEvent)
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
