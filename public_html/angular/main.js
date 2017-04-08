window.app = angular.module("app", ["ngRoute"]);
window.app.config(function($routeProvider) {
  $routeProvider
    .when("/", {
      templateUrl: '../templates/main.html'
    })
    .when("/login", {
      templateUrl: '../templates/login.html'
    })
});
