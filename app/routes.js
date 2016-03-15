'use strict';

app.config(function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: './views/main.html',
    controller: 'MainCtrl as MC'
  }).when('/home', {
    templateUrl: './views/home.html',
    controller: 'MainCtrl as MC'
  }).when('/users', {
      controller: 'ViewCtrl as VC',
      // resolve: {
      //   data: ["dataService", function(dataService) {
      //     return dataService();
      //   }]
      // },
      templateUrl:'./views/home.html'
    });
});
