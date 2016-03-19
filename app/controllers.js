'use strict';

var app = angular.module('capstoneApp.controllers', [])

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

.controller('UserCtrl', function ($scope, $location, getUserService) {
  var vm = this;
  getUserService.get().then(function(user){
    console.log(user.data);
    vm.user = user.data;
  });

})

.controller('EventCtrl', function ($scope, $location, getEventService, rsvpService) {
  var vm = this;
  vm.loadEvents = getEventService.all()
  .then(function(eventsArr) {
    vm.events = eventsArr.data;
  })
  .catch(function(err) {
    console.err(new Error(err));
  });

  vm.rsvp = function(anEvent) {
    rsvpService.rsvp(anEvent).then(function(response) {
      console.log(response);
    });
  };

});


app.controller('DialogController', ['$scope', '$location', '$route', '$mdDialog', 'signupService', 'signinService', 'getUserService', 'postUserService', 'postEventService']);

function DialogController ($scope, $location, $route, $mdDialog, signupService, signinService, getUserService, postUserService, postEventService) {

  // $scope.submitProfile = function(user) {
  //   $scope.user = {
  //     name: user.name,
  //     zip: user.zip,
  //     description: user.userDescript
  //   };
  //   console.log($scope.user);
  //   return $scope.user;
  // };

  $scope.submitSignup = function(user) {
    signupService.submitSignup(user).then(function(response) {
    console.log(response);
    localStorage.setItem('Authorization', 'Bearer ' + response.data.token);
    // vm.loggedStatus = true;
    $location.path('/users');
    $mdDialog.hide();
  });
};

$scope.submitSignin = function(user) {
  signinService.submitSignin(user).then(function(response) {
    console.log(response);
    localStorage.setItem('Authorization', 'Bearer ' + response.data.token);
    // vm.loggedStatus = true;
    $location.path('/users');
    $mdDialog.hide();
  });
};

  $scope.submitProfile = function(user) {
    postUserService.submitProfile(user).then(function(response) {
    console.log(response);
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
    // localStorage.setItem('Authorization', 'Bearer ' + response.data.token);
    // vm.loggedStatus = true;
    // $location.path('/tab/stream');
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
