(function (app) {
  app.factory('lessonsService', function($http, postConverter) {
    var API_URLS = {
      "get": "scripts/lessons.php/hierarchy/",
      "getLessonsRepeat": "scripts/lessons.php/repeatDict",
      "getLessonsType": "scripts/lessons.php/typeDict",
      "add": "scripts/lessons.php/"
    }

    var instance = {
      get: function(hierarchyId, callback) {
        $http({
          method: 'GET',
          url: API_URLS['get'] + hierarchyId
        }).then(function (response) {
          callback(response.data)
        }, function(response) {
          throw new Error(response.data.error);
        })
      },
      getLessonsRepeat: function(callback) {
        $http({
          method: 'GET',
          url: API_URLS['getLessonsRepeat']
        }).then(function(response) {
          callback(response.data)
        }, function(response) {
          throw new Error(response.data.error);
        });
      },
      getLessonsType: function(callback) {
        $http({
          method: 'GET',
          url: API_URLS['getLessonsType']
        }).then(function(response) {
          callback(response.data)
        }, function(response) {
          throw new Error(response.data.error);
        });
      },
      add: function(subject, room, repeat, type, start, finish, hId, callback) {
        $http({
          method: 'POST',
          url: API_URLS["add"],
          data: postConverter({
            subjectId: subject,
            lessonType: type,
            room: room,
            start: start,
            end: finish,
            repeatPeriod: repeat,
            hierarchyId: hId
          })
        }).then(function(response) {
          callback(response.data.id);
        }, function(response) {
          throw new Error(response.data.error);
        });
      }
    };

    return instance;
  })
})(window.app);
