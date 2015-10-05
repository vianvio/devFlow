'use strict';

/* Directives */

angular.module('devCooperation').directive('vmultidropdown', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      options: '=',
      config: '=',
      model: '='
    },
    link: function(scope, element, attrs, ctrl) {
      /* Operation functions */
      scope.itemChoosed = '';
      scope.bDisabled = false;

      scope.displayItemList = function() {
        scope.showItemList = !scope.showItemList;
        scope.bShowAllItem = false;
        scope.itemListLimit = 5;
      };

      scope.showAllItem = function() {
        scope.bShowAllItem = true;
        scope.itemListLimit = scope.arrData.length;
      };

      scope.getItemList = function() {
        scope.itemChoosedList = [];
        scope.arrData.forEach(function(item) {
          if (item.checked) {
            scope.itemChoosedList.push(item.name);
          }
        });
        scope.allChecked = true;
        scope.filteredItems.forEach(function(item) {
          if (!item.checked) {
            scope.allChecked = false;
          }
        });
        scope.itemChoosed = scope.itemChoosedList.join(', ');
      };

      scope.$watchCollection('options', function(newOptions) {
        scope.$evalAsync(function() {
          scope.arrData = [];
          newOptions = newOptions || [];
          // check item is object
          if (typeof newOptions[0] === 'object') {
            scope.arrData = newOptions;
          } else {
            newOptions.forEach(function(item) {
              scope.arrData.push({
                name: item,
                checked: false
              });
            });
          }
        });
      });

      scope.checkAll = function() {
        scope.filteredItems.forEach(function(item) {
          item.checked = scope.allChecked;
        });
        scope.getItemList();
      }

      scope.$watchCollection('filteredItems', function(newFiltered, oldFiltered) {
        if (oldFiltered !== newFiltered) {
          scope.$evalAsync(function() {
            // console.log(newFiltered);
            if (newFiltered.filter(function(item) {
                return !item.checked
              }).length > 0 || newFiltered.length === 0) {
              scope.allChecked = false;
            } else {
              scope.allChecked = true;
            }
            // item less then 5
            if (newFiltered.length <= 5) {
              scope.bShowAllItem = true;
            } else if (scope.itemListLimit === 5) {
              scope.bShowAllItem = false;
            }
          });
        }
      });

      /* Model functions */
      scope.model.initDropdown = function() {
        scope.showItemList = false;
        scope.itemChoosed = '';
        scope.itemChoosedList = [];
        scope.arrData.forEach(function(item) {
          item.checked = false;
        });
        scope.allChecked = false;
        scope.bShowAllItem = false;
        scope.itemListLimit = 5;
        scope.itemFilter = '';
      };

      scope.model.getSelectedResult = function() {
        return scope.itemChoosedList;
      };

      scope.model.setDisabled = function(bDisabled){
        scope.bDisabled = bDisabled;
      };
    },
    templateUrl: 'app/shared/vMultiDropdown/vMultiDropdown.html'
  }
});