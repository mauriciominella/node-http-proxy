// =======================
// get the packages we need ============
// =======================
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
//var config = require('./config'); // get our config file
var User   = require('./users'); // get our mongoose model


var createMobileServer = function(){
  // =======================
  // configuration =========
  // =======================
  var port = process.env.PORT || 8080; // used to create, sign, and verify tokens
  //mongoose.connect(config.database); // connect to database
  //app.set('superSecret', config.secret); // secret variable

  // use body parser so we can get info from POST and/or URL parameters
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  // use morgan to log requests to the console
  app.use(morgan('dev'));


  // API ROUTES -------------------

  // get an instance of the router for api routes
  var apiRoutes = express.Router();

  apiRoutes.get('/mobile', function(req, res) {
      res.send('I am the mobile api at http://localhost:' + port + '/api');
  });

  // route to authenticate a user (POST http://localhost:8080/api/authenticate)
  apiRoutes.post('/authenticate', function(req, res) {

    username = req.body.username;
    if (username != 'admin') {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (username) {

      // check if password matches
      if ('1234' != req.body.password) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {

        // if user is found and password is right
        // create a token
        var token = jwt.sign(username, 'superSecret', {

        });

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }

    }
  });

  // route middleware to verify a token
  app.use(function(req, res, next) {

    if(req.url.indexOf('authenticate') > -1){
      next();
      return;
    }

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {

      // verifies secret and checks exp
      jwt.verify(token, 'superSecret', function(err, decoded) {
        if (err) {
          return res.json({ success: false, message: 'Failed to authenticate token.' });
        } else {
          // if everything is good, save to request for use in other routes
          req.decoded = decoded;
          next();
        }
      });

    } else {

      // if there is no token
      // return an error
      return res.status(403).send({
          success: false,
          message: 'No token provided.'
      });

    }
  });

  // apply the routes to our application with the prefix /api
  app.use('/api', apiRoutes);

  // =======================
  // start the server ======
  // =======================
  app.listen(port);
  console.log('Magic happens at http://localhost:' + port);
}

module.exports = createMobileServer;
