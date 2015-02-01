'use strict';

var User = require('./user.model'),
    auth = require('../../auth/auth.service'),
    CODE = require('../../components/protocol/CODE');

// 회원 가입
module.exports.create = function (req, res, next) {
    var email = req.body.email,
        password = req.body.password,
        nickname = req.body.nickname;
    new User({
        role: 'user',
        nickname: nickname,
        email: email,
        password: password,
        registered: new Date()
    })
        .save(function (err, user) {
            if (err) return next(err);
            res._data = {
                token: auth.makeToken(user)
            };
            next();
        });
};

// 회원 탈퇴
module.exports.remove = function (req, res, next) {
    var userId = req.user._id,
        password = req.body.password;
    User.findById(userId, function (err, user) {
        if (err) return next(err);
        if (!user || user.deleted) return next(CODE.USER.UNREGISTERED);
        if (!user.authenticate(password)) return next(CODE.USER.INCORRECT_PASSWORD);
        user.deleted = new Date();
        user.save(function (err) {
            if (err) return next(err);
            next();
        });
    });
};