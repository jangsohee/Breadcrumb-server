'use strict';


var compose = require('composable-middleware'),
    token = require('../config/auth.token'),
    jwt = require('jsonwebtoken'),
    expressJwt = require('../components/express-jwt'),
    validateJwt = expressJwt({secret: token.cert}),
    config = require('../config/environment'),
    userRoles = config.userRoles,
    User = require('../api/user/user.model'),
    CommonError = require('../components/error'),
    CODE = require('../components/protocol/CODE');

/**
 * Token maker.
 * default: no expiresInMinutes option.
 * @param user
 * @returns {*}
 */
function makeToken(user) {
    var options = {
        algorithm: 'RS256'
    };
    return jwt.sign(user.token, token.key, options);
}

// 어플리케이션 헤더 정보 획득
function getCurrentApp(req, res, next) {
    if (req.headers['current-application']) req.currentApplication = req.headers['current-application'];
    next();
}

// 어플리케이션 헤더 정보 체크
function hasApplication() {
    return compose()
        .use(getCurrentApp)
        .use(function (req, res, next) {
            if (!req.currentApplication) return next(CODE.AUTH.APPLICATION_HEADER);
            next();
        });
}

/**
 * Attaches the user object to the request if authenticated
 * @returns {app}
 */
function isAuthenticated() {
    return compose()
        // 현재 어플리케이션 아이디 체크
        .use(getCurrentApp)
        // Validate jwt
        .use(function (req, res, next) {
            validateJwt(req, res, function (err) {
                if (err) return next(err);
                else next();
            });
        })
        // Attach user to request
        .use(function (req, res, next) {
            User.findById(req.user._id, function (err, user) {
                if (err) return next(err);
                if (!user || user.deleted) return next(CODE.AUTH.INVALID_TOKEN);
                req.auth = req.user = user;
                next();
            });
        });
}

/**
 * Checks if the user role meets the minimum requirements of the route
 * @param roleRequired
 * @returns {app}
 */
function hasRole(roleRequired) {
    if (!roleRequired) throw new CommonError(CODE.USER.SET_ROLE);

    return compose()
        .use(isAuthenticated())
        .use(function meetsRequirements(req, res, next) {
            if (userRoles.indexOf(req.user.role) >= userRoles.indexOf(roleRequired)) {
                next();
            }
            else return next(CODE.AUTH.PERMISSION_DENIED);
        });
}

module.exports.makeToken = makeToken;
module.exports.getCurrentApp = getCurrentApp;
module.exports.hasApplication = hasApplication;
module.exports.isAuthenticated = isAuthenticated;
module.exports.hasRole = hasRole;