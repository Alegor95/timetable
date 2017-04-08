'use strict'
var cookie_token='user_token';
app.controller('userCtrl', ['$scope', '$http', '$cookieStore', '$rootScope', function($scope, $http, $cookieStore, $rootScope){	
	$rootScope.saveUserToken = function(token){
		$cookieStore.put(cookie_token, token);
	}
	$rootScope.getUserToken = function(){
		return $cookieStore.get(cookie_token);
	}
	$rootScope.saveUserSettings = function(user, name, value){
		$cookieStore.put(user.Email+"_"+name, value);
	}
	$rootScope.getUserSettings = function(user, name){
		return $cookieStore.get(user.Email+"_"+name);
	}
	$scope.showConfigModal = function(){
		$rootScope.newConfig = angular.copy($rootScope.scheduleConfig);
		$scope.showModal('config');
	}
	$scope.saveConfig = function(newConfig){
		$rootScope.scheduleConfig = newConfig;
		$rootScope.$broadcast("configUpdated", {});
		$scope.saveUserSettings($scope.loggedUser, 'config', newConfig);
		$scope.hideModal();
	}
	$scope.saveUser = function(newUser){
		var token = $scope.getUserToken();
		var user = {
			surname: newUser.Surname,
			name: newUser.Name,
			email: token.email,
			hash: token.password,
			parentId: $scope.groupData.selected
		};
		$http({
			method:'POST',
			url:$rootScope.appPath+'scripts/users.php/update',
			data: postConverter(user),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}			
		}).success(function(data){
			$rootScope.loggedUser.Surname = user.surname;
			$rootScope.loggedUser.Name = user.name;
			$rootScope.loggedUser.HierarchyId = user.hierarchyId;
			$scope.$broadcast('userLogged', {user:data});
			$scope.hideModal();
		}).error(function(data){
			$scope.showError("Ошибка сервиса", data.error);
			console.error("Сервис вернул ошибку: "+data.error);
		});
	}
	$scope.showProfile = function(){
		$rootScope.newUser = $rootScope.loggedUser;
		$scope.showModal('profile');		
	}
	$scope.registerUser = function(){
		//Create user
		var hash = window.md5($scope.password||'');
		var user = {
			surname: $scope.surname,
			name: $scope.name,
			email: $scope.email,
			password: hash,
			parentId: $scope.groupData.selected
		};
		$http({
			method: 'POST',
			url: $rootScope.appPath+'/scripts/users.php/register',
			data: postConverter(user),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		})
		.success(function(data){
			$scope.saveUserToken({email:user.email, password:user.password});
			$scope.changeView('login');
		})
		.error(function (data, status){
			$scope.showError("Ошибка сервиса", data.error);
			console.error("Сервис вернул ошибку: "+data.error);
		});
	};
	$scope.loginUser = function(){
		var token = $scope.getUserToken();
		if(token == null){
			if (($scope.email == null)||($scope.password == null)) return;
			token = {
				email: $scope.email,
				password: window.md5($scope.password||'')
			};
		}
		$http({
			method: 'POST',
			url: $rootScope.appPath+'/scripts/users.php/login',
			data: postConverter(token),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		})
		.success(function(data){	
			if (data.error == null){				
				$rootScope.loggedUser = data;
				$scope.$broadcast('userLogged', {user:data});
				$rootScope.scheduleConfig = $scope.getUserSettings(data, 'config');
				if ($rootScope.scheduleConfig == null){			
					$rootScope.scheduleConfig = {		
						lessonsStart:{hour:8, minutes:0},
						lessonLength:{hour:1, minutes:35},
						lessonPause:[0, 10, 10, 20, 10, 10, 10, 10],
						lessonCount:7
					};
					$scope.showConfigModal();
				}
				$scope.saveUserToken(token);
			}
		})
		.error(function (data, status){
			$scope.showError("Ошибка сервиса", data.error);
			console.error("Сервис вернул ошибку: "+data.error);
		});
	};	
	$scope.logout = function(){
		$scope.saveUserToken(null);
		$rootScope.loggedUser = null;		
		$scope.$broadcast('userLogout', {});
	}
	$scope.loginUser();
}]);
