var Mockaroo = require('mockaroo');
var debug = require('debug')('devflow:api-field-info.js');

module.exports = function(ApiFieldInfo) {
  ApiFieldInfo.beforeRemote('create', function(ctx, apiFieldInfo, next) {
    // delete all fields by api id
    ApiFieldInfo.destroyAll({
      apiConfigId: ctx.args.data[0].apiConfigId
    }, function(err) {
      if (err) next(err);
      // delete all sample data
      ApiFieldInfo.app.models.JsonSample.destroyAll({
        apiConfigId: ctx.args.data[0].apiConfigId
      }, function(err) {
        if (err) next(err);
        next();
      });
    });
  });

  ApiFieldInfo.afterRemote('create', function(ctx, apiFieldInfo, next) {
    var mockarooClient = new Mockaroo.Client({
      apiKey: 'a6c3a000' // your api key here
    });

    debug('start mockaroo');
    mockarooClient.generate({
      count: 10,
      fields: ctx.args.data
    }).then(function(records) {
      debug('data receieved');
      var _arrSampleData = [];
      records.forEach(function(record) {
        _arrSampleData.push({
          apiConfigId: ctx.args.data[0].apiConfigId,
          sampleData: JSON.stringify(record)
        });
      });

      ApiFieldInfo.app.models.JsonSample.create(_arrSampleData, function(err, arrJsonSamles) {
        if (err) next(err);
        ctx.result = {
          bError: false,
          message: 'Create Api Fields successfully.',
          result: apiFieldInfo
        }
        next();
      });
    }).catch(function(error) {
      debug(error);
    });
  });
};
