'use strict';

angular.module('capstoneApp', ['capstoneApp.services', 'capstoneApp.controllers', 'ngRoute', 'ngMaterial', 'ngMessages'])

.config(function($httpProvider) {

  $httpProvider.interceptors.push("AuthInterceptor");

})

.config(function($mdThemingProvider) {

  $mdThemingProvider.theme('default')
  .primaryPalette('red', {
    'default': '600',
    'hue-1': '800'
  })
  .accentPalette('light-green', {
    'default': '700'
  })
  .backgroundPalette('grey', {
    'default': '300',
    'hue-1': '100'
  });
});
