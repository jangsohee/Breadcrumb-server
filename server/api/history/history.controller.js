'use strict';

var History = require('./history.model'),
    applicationService = require('../application/application.service'),
    CODE = require('../../components/protocol/CODE');

// 히스토리 생성
module.exports.create = function (req, res, next) {
    if (req.body._id) delete req.body._id;
    // TODO #1: 히스토리 생성
    var history = req.body;
    history.registered = new Date();
    new History(history)
        .save(function (err, history) {
            if (err) return next(err);
            // TODO #2: 어플 계정에 히스토리 추가
            applicationService.addHistory(req.currentApplication, history._id, function (err, app) {
                console.log(err);
                if (err) return next(err);
                res._data = history;
                next();
            });
        });
};