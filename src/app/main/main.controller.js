(function() {
  'use strict';

  angular
    .module('eventCalendar')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($scope, $http, $timeout, webDevTec, toastr, uiCalendarConfig) {


    /////////////////////////////////////////////////////

    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    console.log("date " + d);
    console.log("month " + m);
    console.log("year " + y);

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
      url: 'http://localhost:3002/events'
    }).then(function successCallback(response) {
      console.log(response.data);

      var length = response.data.length
      for(var i = 0; i < length ; i++) {
        var event = response.data[i];

        $scope.events.push({
          id: 999,
          title: event.name,
          start: new Date(event.year, 3, event.date),
          allDay: false

        });

      }
    }, function errorCallback(response) {})

    $scope.eventDate  = 0;
    $scope.eventName = "";
    $scope.eventMonth = 0;
    $scope.eventYear = 0;


    $scope.submitEvent = function(){

        console.log($scope.eventMonth);
    }

    $scope.dateChange = function(e) {


      // var evt = {
      //
      //   name: "event.name",
      //   year: $scope.eventDate.getFullYear(),
      //   month:  $scope.eventDate.getMonth(),
      //   date:$scope.eventDate.getDate
      // }

      // var fd = new FormData();
      // fd.append( 'name', "event.name" );
      // fd.append( 'year', $scope.eventDate.getFullYear() );
      // fd.append( 'month', $scope.eventDate.getMonth() );
      // fd.append( 'date', $scope.eventDate.getDate );
      //
      // var req = 'name=sam&description=meeting&year=2017&month=12&date=12'
      //
      // console.log("sending data "+ req);
      // $http.post('http://localhost:3002/event/create',
      //   { data: req,
      //     headers:{'Content-Type': 'application/x-www-form-urlencoded'}
      //   }).then(function(response){
      //
      //   $scope.push({
      //
      //     name: "event.name",
      //     start: new Date($scope.eventDate.getFullYear(), 3, $scope.eventDate.getDate()),
      //     allDay: true
      //
      //   });
      //
      // },function(error){
      //     console.log(error);
      // });

      $http({
        method: 'POST',
        url: 'http://localhost:3002/event/create',
        data: $.param({name: "sam", year: 2017}),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }).then(function(){

        console.log(reponse);
      })

      console.log($scope.eventDate);

    }

    $scope.events = [];
      // {title: 'All Day Event',start: new Date(2017, 3, 1)},
      // {title: 'Long Event',start: new Date(y, m, d - 5),end: new Date(y, m, d - 2)},
      // {id: 999,title: 'Repeating Event',start: new Date(y, m, d - 3, 16, 0),allDay: false},
      // {id: 999,title: 'Repeating Event',start: new Date(y, m, d + 4, 16, 0),allDay: false},
      // {title: 'Birthday Party',start: new Date(y, m, d + 1, 19, 0),end: new Date(y, m, d + 1, 22, 30),allDay: false},
      // {title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}


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
