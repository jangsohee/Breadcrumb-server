'use strict';

var Application = require('./application.model'),
    CODE = require('../../components/protocol/CODE'),
    CommonError = require('../../components/error');

// 어플 계정에 히스토리 추가
module.exports.addHistory = function (id, history, callback) {
    if (!callback) throw new CommonError(CODE.COMMON.REQUIRED_CALLBACK);
    Application.findByIdAndUpdate(id, {$addToSet: {rootHistories: history}}, callback);
};