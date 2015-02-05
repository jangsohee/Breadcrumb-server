'use strict';

var async = require('async'),
    History = require('./history.model'),
    applicationService = require('../application/application.service'),
    CODE = require('../../components/protocol/CODE');

// 히스토리 생성
module.exports.create = function (req, res, next) {
    // TODO #0: 데이터 정리
    if (req.body._id) delete req.body._id;
    var history = req.body;
    if (history.parent) history.parent = history.parent._id || history.parent;
    history.registered = new Date();
    // TODO #1: 히스토리 생성
    new History(history)
        .save(function (err, history) {
            if (err) return next(err);
            async.waterfall([
                function (callback) {
                    if (history.parent) {
                        // TODO #2: 부모 존재시, 부모의 자식으로 등록
                        History.findByIdAndUpdate(history.parent, {$addToSet: {children: history._id}}, function (err, parent) {
                            if (err) return callback(err);
                            callback();
                        });
                    } else {
                        // TODO #3: 부모가 없을시, 어플 계정에 루트 히스토리 추가
                        applicationService.addHistory(req.currentApplication, history._id, function (err, app) {
                            if (err) return callback(err);
                            callback();
                        });
                    }
                }
            ], function (err) {
                // TODO #4: 데이터 리턴
                if (err) return next(err);
                res._data = history;
                next();
            });
        });
};