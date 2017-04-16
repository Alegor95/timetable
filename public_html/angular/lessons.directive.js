(function (app) {
  app.directive('lessons', function() {
    var weekdays = [
      { name: "Понедельник", start: 0},
      { name: "Вторник", start: 86400},
      { name: "Среда", start: 86400 * 2},
      { name: "Четверг", start: 86400 * 3},
      { name: "Пятница", start: 86400 * 4},
      { name: "Суббота", start: 86400 * 5}
    ];

    return {
      restrict: 'E',
      templateUrl: '../templates/lessons.html',
      scope: {
        lessons: '=lessons',
        time: '=time'
      },
      link: function(scope) {
        scope.weekdays = weekdays;
      }
    };
  });
})(window.app);
