(function() {
  'use strict';

  angular
    .module('eventCalendar')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($scope, $http, $timeout, webDevTec, toastr, uiCalendarConfig) {

    $scope.showSubmitButton = true;
    $scope.showEditDeleteButton = false;
    $scope.uiConfig = {
      calendar:{
        height: 450,
        editable: true,
        header:{
          left: 'month basicWeek basicDay',
          center: 'title',
          right: 'today prev,next'
        },
        eventClick: function(event, element) {
          $scope.eventId = event.id;
          $scope.eventDate = event.start['_d'].getDate();
          $scope.eventName = event.title;
          $scope.eventMonth = event.start['_d'].getMonth().toString();
          $scope.eventYear = event.start['_d'].getFullYear();
          $scope.showSubmitButton = false;
          $scope.showEditDeleteButton = true;
        },
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize
      }
    };

    var allEvents = function() {
      $http({
        method: 'GET',
        url: 'http://localhost:3002/api/events'
      }).then(function successCallback(response) {
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
    };

    allEvents();

    $scope.eventId = 0;
    $scope.eventDate  = 0;
    $scope.eventName = "";
    $scope.eventMonth = "";
    $scope.eventYear = 0;
    $scope.submitEvent = function(e) {
      $http({
        method: 'POST',
        url: 'http://localhost:3002/api/event/create',
        data: $.param({
            name: $scope.eventName,
            date: $scope.eventDate,
            month: $scope.eventMonth,
            year: $scope.eventYear
          }),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }).then(function(){
        $scope.eventName = "";
        $scope.eventDate  = 0;
        $scope.eventMonth = "";
        $scope.eventYear = 0;
        $scope.events = [];
        allEvents();
      });
    };

    $scope.editEvent = function (e) {

    };

    $scope.deleteEvent = function (e) {
      $http.delete('http://localhost:3002/api/events/'  + $scope.eventId)
        .then(function(){
          $scope.eventName = "";
          $scope.eventDate  = 0;
          $scope.eventMonth = "";
          $scope.eventYear = "";
          $scope.events = [];
          $scope.showSubmitButton = true;
          $scope.showEditDeleteButton = false;
        allEvents();
      });

    //   $http.delete('http://localhost:3002/api/events/'+$scope.eventId,
    //     {
    //       params: {
    //         Id: $scope.eventId
    //       }
    //     }).then(res=>{
    //     $scope.eventName="";  $scope.eventDate=0;  $scope.eventMonth="";  $scope.eventYear="0";  $scope.events=[
    //
    //   ];  $scope.showSubmitButton=true;  $scope.showEditDeleteButton=false;  allEvents();
    // }).catch(err=>{
    //     returnerr;
    // });

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
