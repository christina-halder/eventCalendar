(function() {
  'use strict';

  angular
    .module('eventCalendar')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
