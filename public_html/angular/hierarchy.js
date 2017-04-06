'use strict'
	var univDataModel = {selected:null,newObj:null};
	var facDataModel = {selected:null,newObj:null};
	var courseDataModel = {selected:null,newObj:null};
	var groupDataModel = {selected:null,newObj:null};	
	var typeHierarchy = {'university':{next:'faculty', data:'univerData'}, 
						'faculty':{next:'course', data:'facData'}, 
						'course':{next:'group', data:'courseData'}, 
						'group':{next: null, data:'groupData'}};
app.controller('hierarchyCtrl', ['$scope', '$http', '$rootScope', '$filter',  function($scope, $http, $rootScope, $filter){
	$scope.$parent.$parent.univerData = univDataModel;
	$scope.$parent.$parent.facData = facDataModel;
	$scope.$parent.$parent.courseData = courseDataModel;
	$scope.$parent.$parent.groupData = groupDataModel;
	//Extends parent scope
	$rootScope.setHierarchy = function(data){
		$scope.selectNewUniversity(data["UNIVERSITY"], function(){
			$scope.selectNewFaculty(data["FACULTY"], function(){
				$scope.selectNewCourse(data["COURSE"], function(){
					$scope.selectNewGroup(data["GROUP"]);
				})
			})
		});
	}
	$scope.updateHierarchy = function(){	
		if ($rootScope.loggedUser!=null){
			$http({
				method:'GET',
				url: $rootScope.appPath+'scripts/hierarchy.php/hierarchyList/'+$rootScope.loggedUser.HierarchyId
			}).success(function(data){
				$rootScope.setHierarchy(data);
			});
		}
	}
	$scope.getHierarchy = function(parentId, type, successCallback){
		//Clear subtemp
		var tempType = type;
		while (tempType != null){
			$scope[tempType] = null;
			$scope[typeHierarchy[tempType].data].selected = null;
			tempType=typeHierarchy[tempType].next;
		}
		if (parentId == '_nf') return;
		$http.get($rootScope.appPath+'/scripts/hierarchy.php/parentId/'+parentId).
		success(function(data, status, headers, config) {
			if (data != null) data.push({ID:'_nf', Name:'Нет в списке'});
			$scope[type] = data;
			if (successCallback) successCallback();
		}).
		error(function(data, status, headers, config) {
			$scope.showError("Ошибка сервиса", data.error);
			console.error("Сервис вернул ошибку: "+data.error);
		});
	};
	$scope.selectNewGroup = function(id){
		$scope.getHierarchy($scope.courseData.selected, 'group', function(){
			$scope.groupData.selected = id+"";
		});
	}
	$scope.selectNewCourse = function(id, callback){
		$scope.getHierarchy($scope.facData.selected, 'course', function(){
			$scope.courseData.selected = id+"";
		});
		$scope.getHierarchy(id, 'group', callback);
	}
	$scope.selectNewFaculty = function(id, callback){
		$scope.getHierarchy($scope.univerData.selected, 'faculty', function(){
			$scope.facData.selected = id+"";
		});
		$scope.getHierarchy(id, 'course', callback);
	}
	$scope.selectNewUniversity = function(id, callback){
		$scope.getHierarchy('', 'university', function(){
			$scope.univerData.selected = id+"";
		});
		$scope.getHierarchy(id, 'faculty', callback);
	};
	$scope.addHierarchy = function(name, parentId, type, successCallback){
		$http({
			method: 'POST',
			url: $rootScope.appPath+'/scripts/hierarchy.php/add',
			data: "parentId=" + parentId+"&name="+name+"&type="+$filter('uppercase')(type),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).
		success(function(data, status, headers, config) {
			$scope.univerData.newObj = '';
			if (data.result == "ok"){
				if (successCallback) successCallback(data.id);
			} else {
				$scope.showError("Ошибка сервиса", data.error);
				console.error("Error: "+data.error);
			}
		}).		
		error(function(data, status, headers, config){
			$scope.showError("Ошибка сервиса", data.error);
			console.error("Сервис вернул ошибку: "+data.error);
		});
	};	
	$scope.getHierarchy('', 'university', null);
	$scope.updateHierarchy();
}]);
