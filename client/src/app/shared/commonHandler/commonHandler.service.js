angular.module('devCooperation')
  .factory('commonHandlerService', [function() {
    var commonHandlerService = {};
    commonHandlerService.formatZero = function(number) {
      // number should always larger than or equal to 0
      return number > 9 ? number : '0' + number;
    };
    return commonHandlerService;
  }]);
