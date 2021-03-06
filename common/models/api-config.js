var Mockaroo = require('mockaroo');
var debug = require('debug')('devflow:api-config.js');
var fs = require('fs');
var sugar = require('sugar');

module.exports = function(ApiConfig) {
  var _getServiceBodyContent = function(apiConfig) {
    var _strServiceBody = fs.readFileSync(__dirname + '/' + '../../server/jsTemplates/serviceBody.template.js', "utf-8");
    // place info
    // get params first
    var _arrParams = apiConfig.urlWithParams.match(/{\w+}/gi);
    var _arrParamsFormated = [];
    _arrParams.forEach(function(param) {
      _arrParamsFormated.push(param.replace(/{|}/g, ''));
    });
    _strServiceBody = _strServiceBody.assign({
      serviceName: apiConfig.serviceName,
      methodName: apiConfig.methodName,
      params: _arrParamsFormated.join(', '),
      paramsInUrl: apiConfig.urlWithParams.substring(0, apiConfig.urlWithParams.length - 1).replace(/{/g, "' + ").replace(/}/g, " + '"),
      apiRoute: apiConfig.route,
      failedResRoute: apiConfig.failedResRoute,
      succeededResRoute: apiConfig.succeededResRoute,
      httpMethod: apiConfig.apiMethod().name.toLowerCase()
    });
    return _strServiceBody;
  };

  ApiConfig.afterRemote('create', function(ctx, apiConfig, next) {
    ctx.result = {
      bError: false,
      message: 'Create Api Config successfully.',
      result: apiConfig
    }
    next();
  });

  ApiConfig.afterRemote('upsert', function(ctx, apiConfig, next) {
    // get project info
    var _angularModuleName = '';
    ApiConfig.app.models.Project.findById(apiConfig.projectId, function(err, project) {
      if (err) next(err);
      _angularModuleName = project.angularModuleName;
      // TODO: find api by http method
      ApiConfig.find({
        where: {
          or: [{
            name: apiConfig.name,
            urlWithParams: {
              like: '.+'
            },
            succeededResRoute: {
              like: '.+'
            },
            failedResRoute: {
              like: '.+'
            },
            isDisabled: {
              neq: true
            }
          }]
        },
        include: ['apiMethod']
      }, function(err, arrApiConfig) {
        if (err) next(err);
        var _arrBodyContent = [];
        arrApiConfig.forEach(function(apiConfigItem) {
          _arrBodyContent.push(_getServiceBodyContent(apiConfigItem));
        });

        var _strServiceHeader = fs.readFileSync(__dirname + '/' + '../../server/jsTemplates/serviceHeader.template.js', "utf-8");
        _strServiceHeader = _strServiceHeader.assign({
          moduleName: _angularModuleName,
          serviceName: apiConfig.serviceName,
          serviceContent: _arrBodyContent.join('\n\n')
        });
        debug(_strServiceHeader);
        // save to file
        
      });

      next();
    });
  });

  ApiConfig.observe('before save', function(ctx, next) {
    // check duplication
    if (ctx.instance && ctx.isNewInstance) {
      _checkDuplication(ctx.instance, ctx, next);
    } else if (ctx.data && ctx.isNewInstance) {
      _checkDuplication(ctx.data, ctx, next);
    } else if (!ctx.isNewInstance) {
      // update
      next();
    } else {
      var err = new Error();
      err.statusCode = 422;
      err.bError = true;
      err.message = 'No data receieved.';
      err.stack = ''; // less info to be sent
      next(err);
    }
  });

  var _checkDuplication = function(apiConfig, ctx, next) {
    ApiConfig.find({
      where: {
        or: [{
          projectId: apiConfig.projectId,
          name: apiConfig.name,
          serviceName: {
            neq: apiConfig.serviceName
          }
        }, {
          projectId: apiConfig.projectId,
          serviceName: apiConfig.serviceName,
          name: {
            neq: apiConfig.name
          }
        }, {
          projectId: apiConfig.projectId,
          serviceName: apiConfig.serviceName,
          name: apiConfig.name,
          methodName: apiConfig.methodName
        }]
      }
    }, function(err, apiConfigs) {
      if (err) throw err;
      if (apiConfigs.length > 0) {
        _afterCheck(true, ctx, next);
      } else {
        _afterCheck(false, ctx, next);
      }
    });
  };

  var _afterCheck = function(bDuplicated, ctx, next) {
    if (bDuplicated) {
      delete ctx.instance;
      delete ctx.data;
      var err = new Error();
      err.statusCode = 422;
      err.bError = true;
      err.message = 'API Name or Service Name or Method name is duplicated';
      err.stack = ''; // less info to be sent
      next(err);
    } else {
      next();
    }
  };

  ApiConfig.createSampleData = function(apiConfigId, req, res, cb) {
    var mockarooClient = new Mockaroo.Client({
      apiKey: 'a6c3a000' // your api key here
    });

    debug('start mockaroo');
    mockarooClient.generate({
      count: 10,
      fields: [{
        name: 'id',
        type: 'Row Number'
      }, {
        name: 'transactionType',
        type: 'Custom List',
        values: ['credit', 'debit']
      }]
    }).then(function(records) {
      debug('data receieved');
      var _arrSampleData = [];
      records.forEach(function(record) {
        _arrSampleData.push({
          apiConfigId: apiConfigId,
          sampleData: JSON.stringify(record)
        });
      });

      ApiConfig.app.models.JsonSample.create(_arrSampleData, function(err, arrJsonSamles) {
        if (err) {
          cb(null, {
            bError: true,
            message: 'Fail to create data',
            result: {
              error: err
            }
          });
        } else {
          cb(null, {
            bError: false,
            message: 'Create data successfully.',
            result: {}
          });
        }
      });
    });
  };

  ApiConfig.remoteMethod('createSampleData', {
    http: {
      path: '/createSampleData',
      verb: 'post'
    },
    accepts: [{
      arg: 'apiConfigId',
      type: 'String'
    }, {
      arg: 'req',
      type: 'object',
      'http': {
        source: 'req'
      }
    }, {
      arg: 'res',
      type: 'object',
      'http': {
        source: 'res'
      }
    }],
    returns: {
      arg: 'data',
      type: 'Object'
    }
  });
};
