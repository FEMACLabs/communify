'use strict';

var app = angular.module('capstoneApp');

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: '../views/main.html'
    // controller: 'MainCtrl as MC'
  }).when('/home', {
    templateUrl: '../views/home.html'
    // controller: 'MainCtrl as MC'
  }).when('/home/myevents', {
    templateUrl: '../views/myevents.html'
    // controller: 'MainCtrl as MC'
  }).when('/home/rsvps', {
    templateUrl: '../views/rsvps.html'
    // controller: 'MainCtrl as MC'
  }).when('/users', {
    templateUrl:'../views/home.html'
    // controller: 'ViewCtrl as VC'
  });
}]);
