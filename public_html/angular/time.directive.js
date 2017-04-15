(function (app) {
  /**
   * Return time in ms
   */
  app.directive('time', function() {

    var minuteS = 60;
    var hourS = 60 * minuteS;

    return {
      restrict: 'E',
      scope: {
        time: "=time"
      },
      templateUrl: "../templates/time.html",
      link: function($scope) {
        $scope.$watch('time', function (val) {
          $scope.hours = Math.floor((val||0) / hourS);
          $scope.minutes = Math.floor(((val||0) - $scope.hours * hourS) / minuteS);
        });

        $scope.$watch('hours', function (val, oldVal) {
          $scope.time = ($scope.time || 0) + (val - oldVal) * hourS;
        });

        $scope.$watch('minutes', function (val, oldVal) {
          $scope.time = ($scope.time || 0) + (val - oldVal) * minuteS;
        });
      }
    }
  })
})(window.app);
