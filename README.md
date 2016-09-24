[![MIT License][license-image]][license-url]

# authentication-rest-api
User authentication restfull api using passport middleware for node.js

## Requirements
* Node JS
* NPM
* Mongo BD

## Installation
```javascript
$ npm install authentication-rest-api
```
## API usage
http://localhost:3000/api/dashboard
in header information must be the token with JWT
Authorization: JWT jsonWebTokenString.....
```javascript
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
```
