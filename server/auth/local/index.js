'use strict';

/**
 *
 * @type {exports}
 */
var _ = require('lodash'),
    express = require('express'),
    passport = require('passport'),
    auth = require('../auth.service'),
    User = require('../../api/user/user.model'),
    json = require('../../components/protocol/json');

var router = express.Router();

// 로그인
router.post('/', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        var error = err || info;
        if (error) return next(error);
        res._data = {
            token: auth.makeToken(user)
        };
        next();
    })(req, res, next)
}, json);

module.exports = router;