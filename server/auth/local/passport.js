'use strict';

var _ = require('lodash');
var passport = require('passport');
var LocalStrategy = require('./passport-local').Strategy;
var CODE = require('../../components/protocol/CODE');

exports.setup = function (User, config) {
	passport.use(new LocalStrategy({
			usernameField: 'email',
			passwordField: 'password' // this is the virtual field on the model
		},
		function (email, password, done) {
			User.findOne({ email: email }, function (err, user) {
				if (err) return done(_.merge({}, CODE.COMMON.ERROR, err));
				if (!user || user.deleted) return done(null, false, CODE.USER.UNREGISTERED);
				if (!user.authenticate(password)) return done(null, false, CODE.USER.INCORRECT_PASSWORD);
				return done(null, user);
			});
		}
	));
};
