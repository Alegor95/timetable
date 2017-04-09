window.app = angular.module("app", ["ngRoute", "ngCookies"]);

window.app.factory('httpRequestInterceptor', function () {
  return {
    request: function (config) {

      config.headers = {
        'X-Requested-With':'XMLHttpRequest',
        'Content-Type':'application/x-www-form-urlencoded'
      };

      return config;
    }
  };
});

window.app.config(function($routeProvider, $httpProvider) {
  $routeProvider
    .when("/", {
      templateUrl: '../templates/main.html'
    })
    .when("/login", {
      templateUrl: '../templates/login.html'
    });
  $httpProvider.interceptors.push('httpRequestInterceptor');
});
