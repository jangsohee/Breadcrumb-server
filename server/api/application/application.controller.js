'use strict';

var _ = require('lodash'),
    async = require('async'),
    Application = require('./application.model'),
    appPop = require('./application.populate'),
    historyService = require('../history/history.service'),
    CODE = require('../../components/protocol/CODE'),
    CommonError = require('../../components/error');

/**
 * 어플리케이션 계정 생성
 *
 * @param req
 * @param res
 * @param next
 */
module.exports.create = function (req, res, next) {
    // 중복 생성을 방지하기 위한, 헤더 상태에 따른 분기 처리
    if (req.currentApplication) {
        // TODO #1 case 1: 어플 계정 데이터 찾기
        _findApp(req.currentApplication, function (err, app) {
            // 에러 처리
            if (err) return next(err);
            // 리턴 데이터 등록
            res._data = app;
            next();
        })
    } else {
        // TODO #1 case 2: 어플 계정 생성
        _createApp(function (err, app) {
            if (err) return next(err);
            res._data = app;
            // 함수 종료(다음 함수 호출)
            next();
        });
    }
};

// 찾기
function _findApp(id, callback) {
    // 콜백이 존재하지 않을 시 에러 리턴
    if (!_.isFunction(callback)) throw new CommonError(CODE.COMMON.REQUIRED_CALLBACK);
    // 어플리케이션 검색 후 콜백
    Application.findById(id, callback);
}

// 생성
function _createApp(callback) {
    // 콜백이 존재하지 않을 시 에러 리턴
    if (!_.isFunction(callback)) throw new CommonError(CODE.COMMON.REQUIRED_CALLBACK);
    // 어플리케이션 생성 후 콜백
    new Application({
        registered: new Date()
    })
        .save(callback);
}

/**
 * 어플리케이션 데이터 호출
 *  - 하위 히스토리 트리 포함
 * @param req
 * @param res
 * @param next
 */
module.exports.get = function (req, res, next) {
    // TODO #1: 어플리케이션 찾기
    Application
        // 기본 정보만 포함
        .findById(req.currentApplication, appPop.select)
        // 루트 히스토리 목록 도큐먼트 포함
        .populate([appPop.roots])
        .exec(function (err, app) {
            if (err) return next(err);
            // TODO #2: 하위 히스토리 재귀 호출
            historyService.walk(app.rootHistories, function (err, histories) {
                // 에러 처리
                if (err) return next(err);
                // 리턴 데이터 등록
                res._data = app;
                // 함수 종료(다음 함수 호출)
                next();
            });
        });
};