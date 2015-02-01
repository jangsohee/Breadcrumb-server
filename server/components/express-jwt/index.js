var jwt = require('jsonwebtoken'),
    CommonError = require('../error'),
    CODE = require('../protocol/CODE');

/**
 * express-jwt/lib/index.js
 *
 * - 에러 코드 변경.
 * - options.skip 로직 제거.
 * - request.query 권한 토큰 로직 제거.
 *
 * @param options
 * @returns {Function}
 */
module.exports = function (options) {
    if (!options || !options.secret) throw new CommonError(CODE.AUTH.MISSING_SECRET);
    return function (req, res, next) {
        var token;
        if (req.method === 'OPTIONS' && req.headers.hasOwnProperty('access-control-request-headers')) {
            for (var ctrlReqs = req.headers['access-control-request-headers'].split(','), i = 0;
                 i < ctrlReqs.length; i++) {
                if (ctrlReqs[i].indexOf('authorization') != -1 || ctrlReqs[i].indexOf('Authorization') != -1) {
                    return next();
                }
            }
        }
        if (req.headers && req.headers.authorization) {
            var parts = req.headers.authorization.split(' ');
            if (parts.length == 2) {
                var scheme = parts[0],
                    credentials = parts[1];
                if (/^Bearer$/i.test(scheme)) {
                    token = credentials;
                } else {
                    return next(CODE.AUTH.AUTHORIZATION_FORMAT);
                }
            } else {
                return next(CODE.AUTH.AUTHORIZATION_FORMAT);
            }
        } else {
            return next(CODE.AUTH.AUTHORIZATION_HEADER);
        }
        jwt.verify(token, options.secret, options, function (err, decoded) {
            if (err) return next(CODE.AUTH.INVALID_TOKEN);
            req.user = decoded;
            next();
        });
    };
};
