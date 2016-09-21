var express = require("express");
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var jwt = require('jwt-simple');
var passport = require('passport');

// General configuration
var config = require('./config/database');
// User model
var User = require('./models/user');

// Parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }));
// Parse application/json
app.use(bodyParser.json());
// Use the passport package in our application
app.use(passport.initialize());
// Passport strategy
require('./config/passport')(passport);
// User controller
var UserController = require('./controllers/users');
// Router
var users = express.Router();

// Add new user
users.route('/add-user').post(UserController.addUser);
// Authenticate user
users.route('/authenticate').post(UserController.authenticate);
// Member zone for testing strategy
users.get('/dashboard', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, config.secret);
    User.findOne({
      name: decoded.name
    }, function(err, user) {
        if (err) throw err;
 
        if (!user) {
          return res.status(403).send({success: false, message: 'User not found.'});
        } else {
          res.json({success: true, message: 'Welcome to dashboard ' + user.name + '!'});
        }
    });
  } else {
    return res.status(403).send({success: false, message: 'No token provided.'});
  }
});
// Get token from header 
getToken = function (headers) {
  var token = null;
  if (headers && headers.authorization) {
    var headers_array = headers.authorization.split(' ');
    if (headers_array.length === 2)
      token = headers_array[1];
  }
  return token;
};

app.use('/api', users);

// Route for testinf port connection
app.get('/', function(req, res) {
	res.send('Testing route for api');
});

// Connect to MongoDB database
mongoose.connect(config.database, function (err, res) {
	if (!err)
		console.log('Connexion to database established succesfully!');
	else
		console.log('ERROR: Connecting to database!');
});

app.listen(3000, function() {
	console.log('Server running ...!');
});