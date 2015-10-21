	{serviceName}.{methodName} = function({params}) {
	  var deferred = $q.defer();
	  $http.{httpMethod}(apiRoute + '/{apiRoute}?{paramsInUrl}).then(function(res) {
	    deferred.resolve(res.{succeededResRoute});
	  }, functoin(res){
	  	deferred.resolve(res.{failedResRoute});
	  });

	  return deferred.promise;
	};