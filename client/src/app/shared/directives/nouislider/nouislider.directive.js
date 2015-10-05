'use strict';

/* Directives */

angular.module('devCooperation').
directive('nouislider', function() {
  return {
    restrict: 'A',
    scope: {
      option: '=',
      model: '='
    },
    link: function(scope, element, attrs, ctrl) {
      var slider = element[0];
      noUiSlider.create(slider, scope.option);

      // set tool tip
      angular.element(slider).find('.noUi-handle').append('<div class="slider-tooltip-holder"><div class="slider-tooltip"></div></div><div class="slider-tooltip-arrow"></div>');

      scope.model.getSlider = function() {
        return slider;
      };

      scope.model.setTooltipText = function(option) {
        var tooltipObj = angular.element(slider).find('.slider-tooltip');
        var tooltipArrowObj = angular.element(slider).find('.slider-tooltip-arrow');
        if (option.title || option.title === 0) {
          tooltipObj.show();
          tooltipArrowObj.show();
          if (option.start) {
            tooltipObj.text(option.title).css({
              marginLeft: '',
              marginRight: -option.start
            });
          } else if (option.end) {
            tooltipObj.text(option.title).css({
              marginLeft: -option.end,
              marginRight: ''
            });
          } else {
            tooltipObj.text(option.title);
          }
        } else {
          tooltipObj.hide();
          tooltipArrowObj.hide();
        }
      };

      scope.model.disableAtValue = function(value) {
        slider.noUiSlider.set(value);
      };

      // scope.model.enable = function() {
      //   angular.element(slider).find('.noUi-origin')[0].removeAttribute('disabled');
      // };

      slider.noUiSlider.on('update', function(value) {
        if (scope.model.updateValue) {
          scope.model.updateValue(value);
        } else {
          scope.model.setTooltipText('');
        }
      });

      if (scope.model.init) {
        scope.model.init();
      }
    }
  }
});
