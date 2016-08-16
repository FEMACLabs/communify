'use strict';

var app = angular.module('communifyApp.controllers', [])

var loggedStatus;

angular.module('communifyApp.controllers', [])

.controller('MainCtrl', function ($scope, $location, $mdDialog, $mdMedia) {

  var vm = this;

  $scope.status = '  ';
  $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

  // SHOW SIGNUP DIALOG
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

  // SHOW SIGNIN DIALOG
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

  // SIGNOUT USER
  $scope.signout = function() {
    localStorage.setItem('Authorization', null);
    localStorage.setItem('id', null);
    loggedStatus = false;
    $location.path('/');
  };

  // SHOW EDIT PROFILE DIALOG
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

  // SHOW CREATE EVENT DIALOG
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

  $scope.myEvents = function() {
    $location.path('/home/myevents');
  };

  $scope.rsvps = function() {
    $location.path('/home/rsvps');
  };

  $scope.allEvents = function() {
    $location.path('/home');
  };

})

.controller('UserCtrl', function ($scope, $mdDialog, getUserService, getEventService) {

  var vm = this;

  // LOAD CURRENT USER DATA
  vm.loadUser = getUserService.all()
  .then(function (user) {
    vm.user = user.data;
  });

  // LOAD ALL EVENTS
  vm.loadEvents = getEventService.all()
  .then(function (eventsArr) {
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

  // LOAD USERS' EVENTS
  vm.loadUser = getUserService.all()
  .then(function(user){
    vm.userEvents = user.data.events;
  });

  // REMOVE RSVP
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

.controller('EventCtrl', function ($scope, $location, $route, $mdDialog, $mdMedia, getEventService, getUserService, rsvpService, removeRsvpService, getOneEventService) {

  var vm = this;

  vm.thisEvent = getOneEventService.thisEvent;

  // LOAD ALL EVENTS
  vm.loadEvents = getEventService.all()
  .then(function(eventsArr) {
    vm.events = eventsArr.data;
  })
  .catch(function(err) {
    console.err(new Error(err));
  });

  // LOAD USER DATA
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
        $scope.$apply();
      }).fail(function() {
        // console.log('error');
    });
  };

  // RESET ZIP CODE FILTER
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

  // ADD RSVP
  vm.rsvp = function(anEvent) {
    anEvent.rsvp = true;
    rsvpService.rsvp(anEvent).then(function(response) {
      console.log(response);
    });
  };

  // REMOVE RSVP
  vm.removersvp = function(anEvent) {
    anEvent.rsvp = false;
    removeRsvpService.removersvp(anEvent).then(function(response) {
      console.log(response);
    });
  };

  vm.getOneEvent = function(ev, thisEvent) {

    getOneEventService.thisEvent = {
      id: thisEvent.id,
      title: thisEvent.title,
      location: thisEvent.location,
      zip: thisEvent.zip,
      eventDescript: thisEvent.eventDescript,
      eventImg: thisEvent.eventImg,
      date: thisEvent.date,
      time: thisEvent.time
    };

    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
    var element = angular.element('#eventsList');

    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'editEventForm.html',
      // parent: angular.element(document.body),
      parent: element,
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
});

app.controller('DialogController', ['$scope', '$location', '$route', '$mdDialog', 'signupService', 'signinService', 'getUserService', 'putUserService', 'postEventService', 'putEventService', 'deleteEventService']);

function DialogController ($scope, $location, $route, $mdDialog, signupService, signinService, getUserService, putUserService, postEventService, putEventService, deleteEventService) {

  $scope.submitSignup = function(user) {
    $scope.authAttempt = true;
    signupService.submitSignup(user).then(function(response) {
      var userID = response.data.user.id;
      console.log(response);
      localStorage.setItem('Authorization', 'Bearer ' + response.data.token);
      localStorage.setItem('id', userID);
      loggedStatus = true;
      $location.path('/home');
      $mdDialog.hide();
      $scope.authAttempt = false;
    });
  };

  $scope.submitSignin = function(user) {
    $scope.authAttempt = true;
    signinService.submitSignin(user).then(function(response) {
      if (response.data.user === undefined) {
        $scope.authAttempt = false;
        $scope.invalidUser = true;
      }
      var userID = response.data.user.id;
      localStorage.setItem('Authorization', 'Bearer ' + response.data.token);
      localStorage.setItem('id', userID);
      loggedStatus = true;
      console.log(loggedStatus);
      $location.path('/home');
      $mdDialog.hide();
      $scope.authAttempt = false;
      return userID;
    });
  };

  $scope.submitProfile = function(user) {
    putUserService.submitProfile(user).then(function(response) {
      $mdDialog.hide();
      $route.reload();
    });
  };

  $scope.date = new Date();
  $scope.minDate = new Date(
    $scope.date.getFullYear(),
    $scope.date.getMonth(),
    $scope.date.getDate() - 0
  );
  $scope.maxDate = new Date(
    $scope.date.getFullYear(),
    $scope.date.getMonth() + 3,
    $scope.date.getDate()
  );

  $scope.submitEvent = function(anEvent) {
    postEventService.submitEvent(anEvent).then(function(response) {
      $mdDialog.hide();
      $route.reload();
    });
  };

  $scope.submitEditEvent = function(anEvent) {
    putEventService.submitEditEvent(anEvent).then(function(response) {
      console.log(response);
      $mdDialog.hide();
      $route.reload();
    });
  };

  $scope.deleteEvent = function(anEvent) {
    deleteEventService.deleteEvent(anEvent).then(function(response) {
      console.log(response);
      $mdDialog.hide();
      $route.reload();
    });
  };

  $scope.showConfirm = function(ev, anEvent) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
      .title('Are you sure you want to delete this event?')
      .ariaLabel('Delete event')
      .targetEvent(ev)
      .ok('Delete')
      .cancel('Cancel');
    $mdDialog.show(confirm).then(function() {
      $scope.deleteEvent(anEvent);
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
