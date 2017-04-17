(function (app) {
  app.directive('lessons', function(lessonsService) {
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

        lessonsService.getLessonsRepeat(function(repeats) {
          var universal = lessonsService.getUniversalRepeat();
          scope.repeats = repeats.filter(_l => _l.ID != universal);
          scope.repeat = scope.repeats[0].ID;
        });

        scope.weekdays = weekdays;
      }
    };
  });
})(window.app);
