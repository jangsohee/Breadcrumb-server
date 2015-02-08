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
        //expiresInMinutes: 30,   // 만료 기한 30분
        algorithm: 'RS256'      // 암호화 알고리즘
    };
    return jwt.sign(user.token, token.key, options);
}

/**
 * Attaches the user object to the request if authenticated
 * @returns {Authenticator}
 */
function isAuthenticated() {
    return compose()
        // Validate jwt
        .use(function (req, res, next) {
            validateJwt(req, res, function (err) {
                if (err) return next(err);
                else next();
            });
        })
        // Attach user to request
        .use(function (req, res, next) {
            User.findById(req.auth._id, function (err, user) {
                if (err) return next(err);
                if (!user || user.deleted) return next(CODE.AUTH.INVALID_TOKEN);
                req.user = user;
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
module.exports.isAuthenticated = isAuthenticated;
module.exports.hasRole = hasRole;