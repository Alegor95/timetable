(function(app) {
  app.factory('hierarchyService', function($http, postConverter) {

    var API_URLS =  {
      types: 'scripts/hierarchy.php/types',
      parents: 'scripts/hierarchy.php/hierarchyList/',
      children: 'scripts/hierarchy.php/parentId/',
      hierarchy: 'scripts/hierarchy.php/hierarchy/',
      add: 'scripts/hierarchy.php/add'
    };

    var types = null;

    var instanse = {
      types: function(callback) {
        if (!types) {
          $http({
              method: 'GET',
              url: API_URLS['types']
          }).then(function(resp){
              types = resp.data;
              callback(types);
          }, function(resp){
              throw new Error(resp.data.error);
          });
        } else {
          callback(types);
        }
      },
      childs: function(parentId, callback) {
        $http({
          method: 'GET',
          url: API_URLS['children'] + (parentId || '')
        }).then(function(resp) {
          callback(resp.data);
        }, function(resp) {
          throw new Error(resp.data.error);
        })
      },
      parents: function(childId, callback) {
        $http({
          method: 'GET',
          url: API_URLS['parents'] + (childId || '')
        }).then(function(resp) {
          callback(resp.data);
        }, function(resp) {
          throw new Error(resp.data.error);
        })
      },
      hierarchy: function(id, callback) {
        $http({
          method: 'GET',
          url: API_URLS['hierarchy'] + id
        }).then(function(resp) {
          callback(resp.data);
        }, function(resp) {
          throw new Error(resp.data.error);
        })
      },
      create: function(name, type, parentId, callback) {
        console.log(name, type, parentId);
        $http({
          method: 'POST',
          url: API_URLS['add'],
          data: postConverter({
            name: name,
            type: type,
            parentId: parentId
          })
        }).then(function(resp) {
          callback(resp.data.id);
        }, function(resp) {
          throw new Error(resp.data.error);
        })
      }
    };

    return instanse;

  });
})(window.app);
