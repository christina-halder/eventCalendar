(function() {
  'use strict';

  angular
    .module('eventCalendar')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($scope, $http, $timeout, webDevTec, toastr, uiCalendarConfig) {

    $scope.uiConfig = {
      calendar:{
        height: 450,
        editable: true,
        header:{
          left: 'month basicWeek basicDay',
          center: 'title',
          right: 'today prev,next'
        },
        eventClick: $scope.alertEventOnClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize
      }
    };

    $http({
      method: 'GET',
      url: 'http://localhost:3002/api/events'
    }).then(function successCallback(response) {
      // console.log(response.data);
      // var length = response.data.length

      for(var i = 0; i < response.data.length ; i++) {
        var event = response.data[i];
        $scope.events.push({
          id: event.id,
          title: event.name,
          start: new Date(event.year, 3, event.date),
          allDay: true
        });
      }
    }, function errorCallback(response) {});

    $scope.eventDate  = 0;
    $scope.eventName = "";
    $scope.eventMonth = 0;
    $scope.eventYear = 0;

    $scope.submitEvent = function(e) {
      $http({
        method: 'POST',
        url: 'http://localhost:3002/api/event/create',
        data: $.param({
            name: $scope.eventName,
            date: $scope.eventDate,
            month: $scope.eventMonth,
            year: $scope.eventYear,
          }),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }).then(function(){
        $scope.eventName = "";
        $scope.eventDate  = 0;
        $scope.eventMonth = 0;
        $scope.eventYear = 2017;
      });
    };

    $scope.events = [];

    $scope.eventSource = {
      url: "http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic",
      className: 'gcal-event',           // an option!
      currentTimezone: 'America/Chicago' // an option!
    };

    $scope.eventsF = function (start, end, timezone, callback) {
      var s = new Date(start).getTime() / 1000;
      var e = new Date(end).getTime() / 1000;
      var m = new Date(start).getMonth();
      var events = [{title: 'Feed Me ' + m,start: s + (50000),end: s + (100000),allDay: false, className: ['customFeed']}];
      callback(events);
    };

    $scope.eventSources = [$scope.events, $scope.eventsF];
  }
})();
