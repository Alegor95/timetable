'use strict'
var weekDays = [
	{name:'Понедельник', timestamp:345600, order:1},
	{name:'Вторник', timestamp:432000,order:2},
	{name:'Среда', timestamp:518400,order:3},
	{name:'Четверг', timestamp:0, order:4},
	{name:'Пятница', timestamp:86400, order:5},
	{name:'Суббота', timestamp:172800, order:6},
];
function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}
app.filter('byWeekdays', function(){
	return function(items, field){
		var sorted = {};
		//Add keys		
		angular.forEach(weekDays, function(weekDay){			
			if (sorted[weekDay.name] == null){
				sorted[weekDay.name] = {name:weekDay.name, order:weekDay.order, timestamp:weekDay.timestamp, lessons:[]};
			}			
		});
		//Add data
		angular.forEach(items, function(item){
			var date = field==null?item:item[field];			
			if (date != null){
				var weekDay = weekDays[date.getDay()].name;
				sorted[weekDay].lessons.push(item);
			}
		});		
		return sorted;
	};
});
app.filter('orderObjectBy', function() {
  return function(items, field, reverse) {
    var filtered = [];
    angular.forEach(items, function(item) {
      filtered.push(item);
    });
    filtered.sort(function (a, b) {
      return (a[field] > b[field] ? 1 : -1);
    });
    if(reverse) filtered.reverse();
    return filtered;
  };
});
app.controller('lessonCtrl', ['$scope', '$http','$filter', '$rootScope', '$document', function($scope, $http, $filter, $rootScope, $document){
	$scope.Math = window.Math;
	$scope.modalData = {newSubject:''};
	$scope.weekDays = weekDays;		
	$scope.newTask = {
		title: null,
		compDate: null,
		lessonId:null
	}
	$scope.hometaskList = {
		top: '0px',
		left: '0px',
		display: false,
		list:[]
	}
	$scope.addHometask = function(newTask){
		$http({
			method:'POST',
			url:$rootScope.appPath+'/scripts/hometask.php',
			data:postConverter({
				title: newTask.title,
				lessonId: newTask.lessonId,
				compDate: newTask.compDate.getTime()/1000
			}),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}			
		}).success(function(data){
			$scope.hometaskList.list.push({
				ID:data.id,
				Name:newTask.title,
				CompletionDate:newTask.compDate
			});
		}).error(function(data){
			$scope.showError("Ошибка сервиса", data.error);
			console.error("Сервис вернул ошибку: "+data.error);
		});
	}
	$scope.removeHometask = function(hometaskId){
		$http({
			method:'POST',
			url:$rootScope.appPath+'/scripts/hometask.php/'+hometaskId+'/delete'
		}).success(function(data){
			var i = 0;
			angular.forEach($scope.hometaskList.list, function(item, index){
				if (item.ID == hometaskId) i = index;
			});
			$scope.hometaskList.list.splice(i, 1);
		}).error(function(data){
			$scope.showError("Ошибка сервиса", data.error);
			console.error("Сервис вернул ошибку: "+data.error);
		})
	}
	$scope.showHometask = function(event, lessonId){
		$scope.hometaskList.top = event.pageY+'px';
		$scope.hometaskList.left = event.pageX+'px';
		$scope.hometaskList.list = [];
		$http({
			method:'GET',
			url:$rootScope.appPath+'/scripts/hometask.php/lesson/'+lessonId
		}).success(function(data){
			angular.forEach(data, function(item){
				item.CompletionDate = new Date(item.CompletionDate);
			});
			$scope.hometaskList.list = data;
			$scope.newTask.lessonId = lessonId;
			$scope.hometaskList.display = true;
			$scope.newTask.title = $scope.newTask.date = null;
		}).error(function(data){
			$scope.showError("Ошибка сервиса", data.error);
			console.error(data.error);
		});
	}
	$scope.showAddingDialog = function (weekDay, start, end, repeatPeriod){
		$scope.showModal('addLesson');	
		$rootScope.newLesson={};
		if (repeatPeriod!=null){
			$rootScope.newLesson.constantRepeat = {ID:repeatPeriod, Title:$scope.getLessonRepeat(repeatPeriod)};
		} else {
			$rootScope.newLesson.lessonRepeat=$rootScope.lessonRepeat;
			$rootScope.newLesson.lessonRepeat[$rootScope.newLesson.lessonRepeat.length] = {ID:'BH', Title:'Каждую неделю'};
		}
		$rootScope.newLesson.start = start;
		$rootScope.newLesson.end = end;
		$rootScope.newLesson.weekDay = weekDay;
	}
	$scope.getLessonRepeat = function(id){
		var result = "";
		angular.forEach($scope.lessonRepeat, function(period){
			if (period.ID == id) result = period.Title;
		});
		return result;
	}
	$scope.getLessonTime = function(number, addPause){
		if (($rootScope.scheduleConfig == null)
		||($rootScope.scheduleConfig == {})) return {hour:0, minutes:0};
		var countedMin = $rootScope.scheduleConfig.lessonsStart.minutes + number*$rootScope.scheduleConfig.lessonLength.minutes;
		var countedHour = $rootScope.scheduleConfig.lessonsStart.hour +number*$rootScope.scheduleConfig.lessonLength.hour;
		var i = 0;
		while (i<number){
			countedMin += $rootScope.scheduleConfig.lessonPause[i++];
		}
		if (addPause) countedMin += $rootScope.scheduleConfig.lessonPause[i];
		var hour = countedHour +  Math.floor(countedMin/60);
		var min = countedMin%60;
		return {hour:hour, minutes:min};
	}
	$scope.timeToString = function(time){
		return pad(time.hour, 2) + ":" + pad(time.minutes,2)
	}
	$scope.getLessonByTime = function(lessons, time){
		var result = null;
		angular.forEach(lessons, function(lesson){
			if ((lesson.PeriodStart.getHours()*60+lesson.PeriodStart.getMinutes()<=time.hour*60+time.minutes)
			&&(lesson.PeriodEnd.getHours()*60+lesson.PeriodEnd.getMinutes()>=time.hour*60+time.minutes)){
                            result = result || {};
                            result[lesson.RepeatTime] = lesson;
			}
		});
		return result;
	}
	$scope.getLessons = function(hierarchyId){
		$http({
			method:'GET',
			url: $rootScope.appPath+'/scripts/lessons.php/hierarchy/'+hierarchyId
		}).success(function(data){
			//Parse dates
			angular.forEach(data, function(item){
				item.PeriodStart = new Date(parseInt(item.PeriodStart*1000));
				item.PeriodEnd = new Date(parseInt(item.PeriodEnd*1000));
			});
			//
			data = $filter('byWeekdays')(data, 'PeriodStart');
			$rootScope.lessons = data;
		}).error(function(data){
			$scope.showError("Ошибка сервиса", data.error);
			console.log('Сервис вернул ошибку: '+data.error);
		});
	};
	$scope.addNewLesson = function(){
		var lesson = $scope.newLesson;
		var data = {
			subjectId:lesson.subject,
			start: lesson.weekDay + lesson.start.hour*60*60+lesson.start.minutes*60,
			end: lesson.weekDay + lesson.end.hour*60*60+lesson.end.minutes*60,
			room: lesson.Room,
			lessonType: lesson.LessonType,
			hierarchyId: $scope.loggedUser.HierarchyId,
			repeatPeriod: lesson.RepeatTime
		}
		$http({
			method:'POST',
			url: $rootScope.appPath+'/scripts/lessons.php',
			data: postConverter(data),
			headers: {'Content-type':'application/x-www-form-urlencoded'}
		}).success(function(data){
			$scope.getLessons($scope.loggedUser.HierarchyId);
			$scope.hideModal();
		}).error(function(data){
			$scope.showError("Ошибка сервиса", data.error);
			console.error("Сервис вернул ошибку: "+data.error);
		});
	}
	$scope.removeLesson = function(lessonId){
		$http({
			method:'POST',
			url:$rootScope.appPath+'/scripts/lessons.php/'+lessonId+'/delete',			
			headers: {'Content-type':'application/x-www-form-urlencoded'}
		}).success(function(){
			$scope.getLessons($scope.loggedUser.HierarchyId);
		}).error(function(data){
			$scope.showError("Ошибка сервиса", data.error);
			console.error("Сервис вернул ошибку: "+data.error);
		});
	}
	$scope.getLessonPeriod = function(){
		$http({
			method:'GET',
			url:$rootScope.appPath+'/scripts/lessons.php/repeatDict'
		}).success(function(data){
			var bhIndex = 0;
			angular.forEach(data, function(item, ind){
				if (item.ID == "BH") {
					bhIndex = ind;
					return;
				}
			});
			data.splice(bhIndex, 1);
			$scope.nowRepeat = data[0].ID;
			$rootScope.lessonRepeat = data;
		}).error(function(data){
			$scope.showError("Ошибка сервиса", data.error);
			console.error("Сервис вернул ошибку: "+data.error);
		});
	}
	$scope.getSubjects = function(){
		$http({
			method:'GET',
			url: $rootScope.appPath+'/scripts/subjects.php',
			headers:{'Content-Type': 'application/x-www-form-urlencoded'}
		}).success(function (data){
			data.push({'ID':'_nf', 'Title':'Нет в списке'});
			$rootScope.subjects = data;
		}).error(function(data){
			$scope.showError("Ошибка сервиса", data.error);
			console.error("Сервис вернул ошибку: "+data.error);
		});		
	};
	$scope.addSubject = function(){
		$http({
			method:'POST',
			url: $rootScope.appPath+'/scripts/subjects.php',
			data: postConverter({'title':$scope.modalData.newSubject}),
			headers:{'Content-Type': 'application/x-www-form-urlencoded'}
		}).success(function(data){
			$scope.subjects.push({'ID':data.id, 'Title':$scope.modalData.newSubject});
			$scope.newLesson.subject = data.id;
		}).error(function (data){
			$scope.showError("Ошибка сервиса", data.error);
			console.error('Сервис вернул ошибку: '+data.error);
		});
	};
	$scope.$on("userLogged", function(events, args){
		var user = args["user"];
		$scope.getLessons(user.HierarchyId);
	})
	$rootScope.$on("configUpdated", function(event, args){
	});
	$scope.$on("userLogout", function(events, args){
		$scope.lessons = null;
		$rootScope.scheduleConfig = null;		
	});
	if ($scope.loggedUser != null){
		$scope.getLessons($scope.loggedUser.HierarchyId);
	}
	$scope.getSubjects();
	$scope.getLessonPeriod();
}]);
