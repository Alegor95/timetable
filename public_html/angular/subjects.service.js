(function(app) {
  app.factory('subjectsService', function($http, postConverter) {

    var API_URLS = {
      "get": "scripts/subjects.php/",
      "add": "scripts/subjects.php/",
    }

    var instance = {
      get: function(callback) {
        $http({
          method: 'GET',
          url: API_URLS["get"]
        }).then(function (response) {
          callback(response.data);
        }, function (response) {
          throw new Error(response.data.error);
        });
      },
      add: function(title, callback) {
        $http({
          method: 'POST',
          url: API_URLS["add"],
          data: postConverter({ title: title })
        }).then(function (response) {
          var id = response.data.id;
          callback({ID: id, Title: title});
        }, function(response) {
          throw new Error(response.data.error);
        })
      }
    };

    return instance;
  });
})(window.app);
