'use strict';

var _ = require('lodash'),
    async = require('async'),
    History = require('./history.model'),
    historyPop = require('./history.populate'),
    CODE = require('../../components/protocol/CODE'),
    CommonError = require('../../components/error');

// 히스토리 재귀 호출
var walk = module.exports.walk = function (histories, callback) {
    if (!callback) throw new CommonError(CODE.COMMON.REQUIRED_CALLBACK);
    var len = histories.length;
    if (len) {
        _.forEach(histories, function (history, i) {
            History
                .findById(history)
                .populate([/*historyPop.keyword,*/ historyPop.parent, historyPop.children])
                .exec(function (err, populatedHistory) {
                    if (err) return callback(err);
                    histories[i] = populatedHistory;
                    walk(histories[i].children, function (err, children) {
                        if (err) return callback(err);
                        histories[i].children = children;
                        if (!--len) callback(null, histories);
                    });
                });
        });
    } else callback(null, histories);
};
