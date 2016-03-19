'use strict';

angular.module('capstoneApp', ['capstoneApp.services', 'capstoneApp.controllers', 'ngRoute', 'ngMaterial', 'ngMessages'])

.config(function($httpProvider) {

  $httpProvider.interceptors.push("AuthInterceptor");

});
