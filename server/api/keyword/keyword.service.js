'use strict';

var _ = require('lodash'),
    async = require('async'),
    breadcrumbKeyword = require('C:/Users/Sohee/Desktop/addonT/Debug/addonT'),
    History = require('../history/history.model'),
    Keyword = require('./keyword.model'),
    User = require('../user/user.model'),
    CODE = require('../../components/protocol/CODE'),
    CommonError = require('../../components/error');


// 키워드 생성
module.exports.create = function (history, parentKeyword, callback) {
    if (!callback) throw new CommonError(CODE.COMMON.REQUIRED_CALLBACK);
    // 키워드 모듈에서 데이터 획득
    var nouns = breadcrumbKeyword.funcTF(history.title, history.body,  history.link, parentKeyword);
    var len = nouns.noun.length;
    // 빈도수 배열 생성
    nouns.DF = [];
    for (var i = 0; i < len; i++) {
        nouns.DF.push(0);
    }
    async.waterfall([
        // 키워드 생성 또는 카운트 증가
        function (next) {
            _.forEach(nouns.noun, function (dummy, i) {
                // 키워드 찾기
                Keyword.findOne({noun: nouns.noun[i], nounType: nouns.nounType[i]}, function (err, keyword) {
                    if (err) return next(err);
                    // 있으면 카운트 증가
                    if (keyword) {
                        keyword.count++;
                        keyword.save(function (err, dbKeyword) {
                            if (err) return next(err);
                            nouns.DF[i] = dbKeyword.count;
                            if (!--len) next(null, nouns);
                        });
                    }
                    // 없으면 생성
                    else {
                        new Keyword({
                            noun: nouns.noun[i],
                            nounType: nouns.nounType[i]
                        })
                            .save(function (err, dbKeyword) {
                                if (err) return next(err);
                                nouns.DF[i] = dbKeyword.count;
                                if (!--len) next(null, nouns);
                            });
                    }
                });
            });
        },
        // 유저의 전체 히스토리 갯수 파악
        function (nouns, next) {
            History.count({}, function (err, count) {
                if (err) return next(err);
                nouns.historyTotalNum = count;
                next(null, nouns);
            })
        },
        // 메인 키워드 추출
        function (nouns, next) {
            var keyword = breadcrumbKeyword.funcExtract(nouns.historyTotalNum, nouns.noun, nouns.nounType, nouns.DF, nouns.TF);
            next(null, keyword);
        }
    ], function (err, keyword) {
        // 데이터 리턴
        if (err) callback(err);
        callback(null, keyword);
    });
};
