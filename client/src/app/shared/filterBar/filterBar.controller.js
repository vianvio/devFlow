'use strict';

angular.module('devCooperation')
  .controller('filterBarController', ['$scope', function($scope) {
  	var initialize = function(){
  		$scope.collapse = true;
  	}();

  	$scope.showFilter = function(){
  		$scope.collapse = $scope.collapse ? false : true;
  	};
  }]);