var mongoose = require('mongoose');
var User = require('../models/user');
var bcrypt = require('bcrypt');
var jwt = require('jwt-simple');
var config = require('../config/database');

// POST - Insert new User in the DB
exports.addUser = function (req, res, next) {
	bcrypt.genSalt(10, function (err, salt) {
		if (err) {
			return res.status(500).send({ error: err.messager });
		}
		bcrypt.hash(req.body.password, salt, function (err, hash) {
			if (err) {
				return res.status(500).send({ error: err.messager });
			}
			var password = hash;
			var user = new User({
				name: req.body.name,
				password: password
			});
			user.save(function (err, user) {
				if (err) {
					return res.json({success: false, message: 'User already exists.'});
				}
				res.json({success: true, message: 'User created successfully'});
			});
		});
	});
}

// POST - Authenticate a User
exports.authenticate = function (req, res, next) {
	User.findOne({
		name: req.body.name
	}, function (err, user) {
		if (err) {
			return res.status(500).send({ error: err.messager });
		}
		if (!user) {
			res.send({success: false, message: 'User not found.'});
		} else {			
			bcrypt.compare(req.body.password, user.password, function (err, isMatch) {
				if (err) {
					return res.status(500).send({ error: err.messager});
				}
				if (isMatch && !err) {
					var token = jwt.encode(user, config.secret);
					// Include the JWT in requests e.g. Authorization: JWT JSON_WEB_TOKEN_STRING...
					res.json({success: true, token: 'JWT ' + token});
				} else {
					res.send({sucess: false, message: 'Wrong password.'});
				}				
			});
		}
	});
}