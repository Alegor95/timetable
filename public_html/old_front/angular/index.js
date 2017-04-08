'use strict'
var app = angular.module('myApp', ['ngCookies', 'ngAnimate'])
.run(function($rootScope) {
    $rootScope.subjects = [];
	$rootScope.sheduleConfig = {};
	$rootScope.error = null;
	$rootScope.appPath = ''
});
var mainViews = {
	"login":{url:'login_part.html'},
	"register":{url:'register_part.html'}
};
var modalViews={
	"addLesson":{url:'addLesson_modal.html', title:"Добавить занятие"},
	"config":{url:'config_modal.html', title: 'Настройки'},
	"profile":{url:'profile_modal.html', title: 'Профиль'}
};
app.controller('mainCtrl', ['$scope','$interval', '$window', function($scope, $interval, $window){
	$scope.currentView = mainViews["login"];
	$scope.currentModal = null;
	$scope.confirm = function (msg){
		return $window.confirm(msg);
	}
	$scope.changeView = function(viewName){
		$scope.currentView = mainViews[viewName];
	}
	$scope.showModal = function(modalName){
		$scope.currentModal = modalViews[modalName];
                $("#model").openModal();
	}
	$scope.hideModal = function(){
                $("#model").closeModal();
		$scope.currentModal = null;
	}
	$scope.iterate = function(number){
		return new Array(number);
	}
	$scope.showError=function(header, message){
                Materialize.toast(
                    '<span class="blue-text">'+header+': </span>'+message,
                    3000);
	}
}]);
