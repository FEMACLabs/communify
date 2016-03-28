'use strict';

var app = angular.module('capstoneApp.controllers', [])

var loggedStatus;

angular.module('capstoneApp.controllers', [])

.controller('MainCtrl', function ($scope, $location, $mdDialog, $mdMedia) {

  var vm = this;

  $scope.status = '  ';
  $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

  $scope.signup = function(ev) {
    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'signupForm.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:false,
      fullscreen: useFullScreen
    });
    $scope.$watch(function() {
      return $mdMedia('xs') || $mdMedia('sm');
    }, function(wantsFullScreen) {
      $scope.customFullscreen = (wantsFullScreen === true);
    });
  };

  $scope.signin = function(ev) {
    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'signinForm.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:false,
      fullscreen: useFullScreen
    });
    $scope.$watch(function() {
      return $mdMedia('xs') || $mdMedia('sm');
    }, function(wantsFullScreen) {
      $scope.customFullscreen = (wantsFullScreen === true);
    });
  };

  $scope.signout = function() {
    localStorage.setItem('Authorization', null);
    localStorage.setItem('id', null);
    loggedStatus = false;
    $location.path('/');
  };

  $scope.editProfile = function(ev) {
    console.log(ev);
    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'profileForm.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:false,
      fullscreen: useFullScreen
    });
    $scope.$watch(function() {
      return $mdMedia('xs') || $mdMedia('sm');
    }, function(wantsFullScreen) {
      $scope.customFullscreen = (wantsFullScreen === true);
    });
  };

  $scope.createEvent = function(ev) {
    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'eventForm.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:false,
      fullscreen: useFullScreen
    });
    $scope.$watch(function() {
      return $mdMedia('xs') || $mdMedia('sm');
    }, function(wantsFullScreen) {
      $scope.customFullscreen = (wantsFullScreen === true);
    });
  };

  // $scope.editEvent = function(ev) {
  //   console.log(ev);
  //   var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
  //   $mdDialog.show({
  //     controller: DialogController,
  //     templateUrl: 'editEventForm.html',
  //     parent: angular.element(document.body),
  //     targetEvent: ev,
  //     clickOutsideToClose:false,
  //     fullscreen: useFullScreen
  //   });
  //   $scope.$watch(function() {
  //     return $mdMedia('xs') || $mdMedia('sm');
  //   }, function(wantsFullScreen) {
  //     $scope.customFullscreen = (wantsFullScreen === true);
  //   });
  // };

})

.controller('UserCtrl', function ($scope, $mdDialog, getUserService, getEventService) {

  var vm = this;

  vm.loadUser = getUserService.all()
    .then(function(user){
      vm.user = user.data;
    });

    vm.loadEvents = getEventService.all()
    .then(function(eventsArr) {
      vm.events = eventsArr.data;
    })
    .catch(function(err) {
      console.err(new Error(err));
    });

    var originatorEv;
    vm.openMenu = function($mdOpenMenu, ev) {
      originatorEv = ev;
      $mdOpenMenu(ev);
    };
    vm.notificationsEnabled = true;
    vm.toggleNotifications = function() {
      vm.notificationsEnabled = !vm.notificationsEnabled;
    };

})

.controller('UserEventCtrl', function ($scope, getUserService, removeRsvpService) {
  var vm = this;
  vm.loadUser = getUserService.all()
    .then(function(user){
      vm.userEvents = user.data.events;
    });

  vm.removersvp = function(anEvent) {
    var index;
    for (var i = 0; i < vm.userEvents.length; i++) {
      if (vm.userEvents[i].id === anEvent.id) {
        index = i;
        anEvent = vm.userEvents[i];
      }
    }
    removeRsvpService.removersvp(anEvent).then(function(response) {
      console.log(response);
    });
    vm.userEvents.splice(index, 1);
  };

})

.controller('EventCtrl', function ($scope, $location, $route, $mdDialog, $mdMedia, getEventService, getUserService, rsvpService, removeRsvpService) {

  var vm = this;

  vm.loadEvents = getEventService.all()
  .then(function(eventsArr) {
    vm.events = eventsArr.data;
  })
  .catch(function(err) {
    console.err(new Error(err));
  });

  vm.loadUser = getUserService.all()
    .then(function(user){
      vm.user = user.data;
    });

  vm.zipFilter = function() {
    vm.chosenDistance = vm.miles;
    $.ajax({
      'url': 'https://www.zipcodeapi.com/rest/js-AMERYbpnnuIK8RLikdCUSyU2WGY3e5TPRyGQJ5e7AXRIOD18QD2JbWM8CKbRP5GH/radius.json/'+vm.user.zip+'/'+vm.miles+'/mile',
      'dataType': 'json'
    }).done(function(data) {
        // console.log('success response');
        console.log(data);
        vm.filterZips = data.zip_codes;
        vm.zipFilteredEvents = [];
        var i = 0;
        while (i < vm.events.length) {
          var match = false;
          for (var j = 0; j < vm.filterZips.length; j++) {
            if (vm.events[i].zip === vm.filterZips[j].zip_code) {
              match = true;
              // vm.zipFilteredEvents.push(vm.events[j]);
            }
          }
          if (match === false) {
            vm.events.splice(i, 1);
          } else {
            i++;
          }
        }
        console.log(vm.events);
        $scope.$apply();
      }).fail(function() {
        console.log('error');
    });
  };

  vm.reset = function() {
    $route.reload();
  };

  vm.distance = [
      "5",
      "10",
      "20",
      "50",
      "100"
  ];

  vm.rsvp = function(anEvent) {
    anEvent.rsvp = true;
    rsvpService.rsvp(anEvent).then(function(response) {
      console.log(response);
    });
  };

  vm.removersvp = function(anEvent) {
    anEvent.rsvp = false;
    removeRsvpService.removersvp(anEvent).then(function(response) {
      console.log(response);
    });
  };

  vm.getOneEvent = function(thisEvent, eventId) {
    console.log(thisEvent);
    console.log(eventId);
    vm.loadEvents = getEventService.all()
    .then(function(eventsArr) {
      for (var i  = 0; i < vm.events.length; i++) {
        if (eventId === vm.events[i].id) {
          vm.thisIndex = i;
          // console.log(vm.events[vm.thisIndex]);
          vm.thisEvent = eventsArr.data[vm.thisIndex];
          console.log(vm.thisEvent);
          vm.editEvent(vm.thisEvent);
        }
      }
    })
    .catch(function(err) {
      console.err(new Error(err));
    });
  };

  vm.editEvent = function(ev) {
    console.log(ev);
    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'editEventForm.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:false,
      fullscreen: useFullScreen
    });
    $scope.$watch(function() {
      return $mdMedia('xs') || $mdMedia('sm');
    }, function(wantsFullScreen) {
      $scope.customFullscreen = (wantsFullScreen === true);
    });
  };

  // var editEvent = function(ev) {
  //   var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
  //   $mdDialog.show({
  //     controller: DialogController,
  //     templateUrl: 'editEventForm.html',
  //     parent: angular.element(document.body),
  //     targetEvent: ev,
  //     clickOutsideToClose:false,
  //     fullscreen: useFullScreen
  //   });
  //   $scope.$watch(function() {
  //     return $mdMedia('xs') || $mdMedia('sm');
  //   }, function(wantsFullScreen) {
  //     $scope.customFullscreen = (wantsFullScreen === true);
  //   });
  // };


});

app.controller('DialogController', ['$scope', '$location', '$route', '$mdDialog', 'signupService', 'signinService', 'getUserService', 'putUserService', 'postEventService', 'putEventService']);

function DialogController ($scope, $location, $route, $mdDialog, signupService, signinService, getUserService, putUserService, postEventService, putEventService) {

  $scope.submitSignup = function(user) {

    signupService.submitSignup(user).then(function(response) {
    var userID = response.data.user.id;
    console.log(response);
    localStorage.setItem('Authorization', 'Bearer ' + response.data.token);
    localStorage.setItem('id', userID);
    loggedStatus = true;
    $location.path('/home');
    $mdDialog.hide();
  });
};

$scope.submitSignin = function(user) {
  signinService.submitSignin(user).then(function(response) {
    var userID = response.data.user.id;
    localStorage.setItem('Authorization', 'Bearer ' + response.data.token);
    localStorage.setItem('id', userID);
    loggedStatus = true;
    console.log(loggedStatus);
    $location.path('/home');
    $mdDialog.hide();
    return userID;
  });
};

  $scope.submitProfile = function(user) {

    putUserService.submitProfile(user).then(function(response) {
    console.log(response);
    console.log(user);
    $mdDialog.hide();
    $route.reload();
  });
};

  $scope.date = new Date();
  $scope.minDate = new Date(
      $scope.date.getFullYear(),
      $scope.date.getMonth(),
      $scope.date.getDate() - 0);
  $scope.maxDate = new Date(
      $scope.date.getFullYear(),
      $scope.date.getMonth() + 3,
      $scope.date.getDate());

  $scope.submitEvent = function(anEvent) {
    anEvent.is_owner = true;
    postEventService.submitEvent(anEvent).then(function(response) {
    console.log(response);
    $mdDialog.hide();
    $route.reload();
  });
};

$scope.submitEditEvent = function(anEvent) {
  anEvent.is_owner = true;
  putEventService.submitEditEvent(anEvent).then(function(response) {
  console.log(response);
  $mdDialog.hide();
  $route.reload();
});
};

  $scope.hide = function() {
    $mdDialog.hide();
  };
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.answer = function(answer) {
    $mdDialog.hide(answer);
  };

}
