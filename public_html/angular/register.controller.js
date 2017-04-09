(function(app){
  app.controller('registerController', function($scope) {
    $scope.newUser = {};
    $scope.register = function(user) {
      console.log(user);
    }
  })
}(window.app));
