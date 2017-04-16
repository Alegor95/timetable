(function(app) {
  app.controller(
    'lessonsController',
    function($scope, lessonsService, settingsService, $location) {

      settingsService.get($scope.authorized, function(lessonsTime) {
        $scope.lessonsTime = lessonsTime;
        if (!lessonsTime || !lessonsTime.length) $location.url("/settings");
      });

      $scope.$watch("authorized.HierarchyId", function (val) {
        lessonsService.get($scope.authorized.HierarchyId, function(lessons) {
          $scope.lessons = lessons;
        });
      });

    }
  );
})(window.app);
