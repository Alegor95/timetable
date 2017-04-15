(function(app) {
  app.controller('profileController', function($scope, usersService) {

      $scope.currentUser = angular.copy($scope.authorized);

      $scope.update = function(user) {
        usersService.update(
          user.Name, user.Surname,
          $scope.authorized.Email, $scope.authorized.Password,
          user.HierarchyId, function() {
            //$scope.currentUser.HierarchyId = user.HierarchyId;
            angular.copy($scope.currentUser, $scope.authorized);
          }
        );
      }
  });
})(window.app);
