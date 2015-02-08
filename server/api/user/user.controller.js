'use strict';

var User = require('./user.model'),
    auth = require('../../auth/auth.service'),
    applicationService = require('../application/application.service'),
    CODE = require('../../components/protocol/CODE');

// 이메일 검증
module.exports.checkEmail = function (req, res, next) {
    var email = req.params.email;
    var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (regex.test(email)) {
        User.findOne({email: email}, function (err, user) {
            if (err) return next(err);
            if (user) return next(CODE.USER.DUPLICATE_EMAIL);
            next();
        });
    } else return next(CODE.USER.INVALID_EMAIL);
};

// 회원 가입
module.exports.create = function (req, res, next) {
    // TODO #1: 변수 정리
    var email = req.body.email,
        password = req.body.password,
        nickname = req.body.nickname;
    // TODO #2: 어플리케이션 생성
    applicationService.create(function (err, app) {
        if (err) return next(err);
        // TODO #3: 유저 생성
        new User({
            role: 'user',
            nickname: nickname,
            email: email,
            password: password,
            application: app._id,
            registered: new Date()
        })
            .save(function (err, user) {
                if (err) return next(err);
                // TODO #4: 데이터 리스폰스
                res._data = {
                    token: auth.makeToken(user)
                };
                next();
            });
    });
};

// 회원 탈퇴
module.exports.remove = function (req, res, next) {
    var user = req.user,
        password = req.body.password;
    if (!user.authenticate(password)) return next(CODE.USER.INCORRECT_PASSWORD);
    user.deleted = new Date();
    user.save(function (err) {
        if (err) return next(err);
        next();
    });
};