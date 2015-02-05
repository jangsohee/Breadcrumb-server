'use strict';

var Keyword = require('./keyword.model'),
    CODE = require('../../components/protocol/CODE'),
    CommonError = require('../../components/error');


// 키워드 생성
module.exports.create = function (appId, noun, callback) {
    if (!callback) throw new CommonError(CODE.COMMON.REQUIRED_CALLBACK);
    new Keyword({
        application: appId,
        noun: noun,
        registered: new Date()
    }).save(callback);
};

// 키워드 카운트 증가
module.exports.incCount = function (appId, noun, callback) {
    if (!callback) throw new CommonError(CODE.COMMON.REQUIRED_CALLBACK);
    Keyword.findOneAndUpdate({application: appId, noun: noun}, {$inc: {count: 1}}, callback);
};