'use strict';

angular.module('capstoneApp', ['capstoneApp.services', 'capstoneApp.controllers', 'ngRoute', 'ngMaterial', 'ngMessages'])

.config(function($httpProvider) {

  $httpProvider.interceptors.push("AuthInterceptor");

})

.config(function($mdThemingProvider) {

  $mdThemingProvider.theme('default')
  .primaryPalette('red')
  .accentPalette('grey');
});
