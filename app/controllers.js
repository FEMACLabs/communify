'use strict';

var app = angular.module('capstoneApp.controllers', [])

var loggedStatus;

angular.module('capstoneApp.controllers', [])

.controller('MainCtrl', function ($scope, $location, $mdDialog, $mdMedia) {

  $scope.status = '  ';
  $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

  $scope.signup = function(ev) {
    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'signupForm.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
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
      clickOutsideToClose:true,
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
    console.log(loggedStatus);
    $location.path('/');
  };

  $scope.editProfile = function(ev) {
    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'profileForm.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
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
      clickOutsideToClose:true,
      fullscreen: useFullScreen
    });
    $scope.$watch(function() {
      return $mdMedia('xs') || $mdMedia('sm');
    }, function(wantsFullScreen) {
      $scope.customFullscreen = (wantsFullScreen === true);
    });
  };

})

.controller('UserCtrl', function ($scope, getUserService) {

  $scope.loadUser = getUserService.all()
    .then(function(user){
      $scope.user = user.data;
      console.log($scope.user);
    });

})

.controller('UserEventCtrl', function ($scope, getUserService) {
  var vm = this;
  vm.loadUser = getUserService.all()
    .then(function(user){
      vm.userEvents = user.data.events;
      console.log(vm.userEvents);
    });

})

.controller('EventCtrl', function ($scope, $location, getEventService, rsvpService) {
  var vm = this;
  vm.loadEvents = getEventService.all()
  .then(function(eventsArr) {
    vm.events = eventsArr.data;
    console.log(vm.events);
  })
  .catch(function(err) {
    console.err(new Error(err));
  });

  vm.rsvp = function(anEvent) {
    for (var i = 0; i < vm.events.length; i++) {
      if (vm.events[i].id === anEvent.id) {
        anEvent = vm.events[i];
      }
    }
    console.log(vm.events);
    console.log('click event works');
    rsvpService.rsvp(anEvent).then(function(response) {
      console.log(response);
    });
  };

});

app.controller('DialogController', ['$scope', '$location', '$route', '$mdDialog', 'signupService', 'signinService', 'getUserService', 'putUserService', 'postEventService']);

function DialogController ($scope, $location, $route, $mdDialog, signupService, signinService, getUserService, putUserService, postEventService) {

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
    postEventService.submitEvent(anEvent).then(function(response) {
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
