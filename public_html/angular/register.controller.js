(function(app){
  app.controller('registerController', function($scope, $location, usersService) {
    $scope.newUser = {};
    $scope.register = function(user) {
      console.log(user);
      usersService.register(
        user.Name, user.Surname,
        user.Email, user.Password,
        user.HierarchyId, function() {
          $scope.login(user.Email, user.Password, function(){
            $location.url('/');
          });
        }
      );
    };
  })
}(window.app));
