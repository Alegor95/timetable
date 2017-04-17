(function (app) {
  app.directive("lesson", function(lessonsService) {

    var UNIVERSAL_REPEAT = lessonsService.getUniversalRepeat();

    return {
      restrict: 'E',
      templateUrl: '../templates/lesson.html',
      scope: {
        lessons: '=lessons',
        time: '=time',
        repeat: '=repeat',
        day: '=day'
      },
      link: function(scope) {
        var getLesson = function(lessonTime, lessons, repeat) {
          for (var i in lessons) {
            var lesson = lessons[i];
            if (((lesson.RepeatTime == scope.repeat) || (lesson.RepeatTime == UNIVERSAL_REPEAT))
                && (lesson.PeriodStart >= lessonTime.start + scope.day.start)
                && (lesson.PeriodEnd <= lessonTime.finish + scope.day.start)) {
              return lesson;
            }
          }
        };

        scope.lesson = getLesson(scope.time, scope.lessons);

        scope.$watch('repeat', function() {
          scope.lesson = getLesson(scope.time, scope.lessons);
        });
      }
    }
  });
})(window.app);
