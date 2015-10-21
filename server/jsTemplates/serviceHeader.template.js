angular.module('{moduleName}')
  .factory('{serviceName}', ['$http', '$q', 'api', function($http, $q, api) {
    var {serviceName} = {};
    var apiRoute = api.isDev ? api.devRoute : api.proRoute;

{serviceContent}

    return {serviceName};
  }]);
