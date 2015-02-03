'use strict';

var _ = require('lodash'),
    async = require('async'),
    Application = require('./application.model'),
    CODE = require('../../components/protocol/CODE'),
    CommonError = require('../../components/error');

// 어플 계정 생성
module.exports.create = function (req, res, next) {
    // 중복 생성을 방지하기 위한, 헤더 상태에 따른 분기 처리
    if (req.currentApplication) {
        // 어플 계정 데이터 찾기
        _findApp(req.currentApplication, function (err, app) {
            if (err) return next(err);
            res._data = app;
            next();
        })
    } else {
        // 어플 계정 생성
        _createApp(function (err, app) {
            if (err) return next(err);
            res._data = app;
            next();
        });
    }
};

// 찾기
function _findApp(id, callback) {
    if (!_.isFunction(callback)) throw new CommonError(CODE.COMMON.REQUIRED_CALLBACK);
    Application.findById(id, callback);
}

// 생성
function _createApp(callback) {
    if (!_.isFunction(callback)) throw new CommonError(CODE.COMMON.REQUIRED_CALLBACK);
    new Application({
        registered: new Date()
    })
        .save(callback);
}