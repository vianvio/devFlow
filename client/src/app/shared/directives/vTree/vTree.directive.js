'use strict';

/* Directives */

angular.module('devCooperation').
directive('vtreenode', ['$compile', 'projectService', function($compile, projectService) {
  return {
    restrict: 'E',
    scope: {
      nodes: '='
    },
    link: function(scope, element, attrs, ctrl) {
      // order the nodes, angular filter orderBy not work here
      scope.nodes = scope.nodes.sort(function(item1, item2) {
        return item1.levelIndex - item2.levelIndex;
      });
      // console.log(scope.nodes);
      var template = "<div class='vTreeNode-bar position-relative' ng-class='getClassByNode(node)' ng-repeat='node in nodes track by $index'><span ng-click='nodebarDisplay($event, node)' class='vTreeNode-title'>{{node.name}}</span><vtreenode nodes='node.nodes'></vtreenode></div>";
      var $template = angular.element(template);
      $compile($template)(scope);
      element.append($template);

      scope.getClassByNode = function(node) {
        var _result = '';
        _result += node.isFolder ? 'vTreeNode-folder ' : 'vTreeNode-file';
        _result += node.bOpen ? 'vTreeNode-open ' : '';

        return _result;
      };

      scope.nodebarDisplay = function(event, node) {
        if (node.isFolder) {
          node.bOpen = !node.bOpen;
          projectService.loadFolder(node);
        } else {
          // call service to load file
          projectService.loadFile(node);
        }
      };
    }
  }
}]);
