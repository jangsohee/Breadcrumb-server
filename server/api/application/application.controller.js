'use strict';

var _ = require('lodash'),
    async = require('async'),
    Application = require('./application.model'),
    appPop = require('./application.populate'),
    historyService = require('../history/history.service'),
    CODE = require('../../components/protocol/CODE');

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
        .findById(req.user.application, appPop.select)
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