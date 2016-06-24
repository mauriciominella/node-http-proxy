var matchRules = require('./middlewares/match-rules')
var proxy = require('./middlewares/proxy')

function application () {
  var app = (require('express'))();

  app.use(matchRules);
  app.use(proxy);
  return app;
}

module.exports = {
  start: function (config) {
      var app = application(config);

      app.listen(9000, function(){
        console.log('listening...')
      });
  },
};
