'use strict';

var express = require('express'),
    Keyword = require('../keyword.model'),
    TDB = require('C:/Users/Sohee/Desktop/addonT/Debug/addonTDB'),
    json = require('../../../components/protocol/json');

var router = express.Router();

// addonTDB의 데이터 전체를 몽고에 저장
router.post('/', function (req, res, next) {
    // dummies 는 { historyTotalNum, noun[], nounType[], DF[] } 형태
    var dummies = TDB.add();
    var len = dummies.noun.length;
    console.log(len);
    async.waterfall([
        // 키워드 생성 또는 카운트 증가
        function (done) {
            _.forEach(dummies.noun, function (dummy, i) {
                // 키워드 찾기
                Keyword.findOne({noun: dummies.noun[i], nounType: dummies.nounType[i]}, function (err, keyword) {
                    if (err) return done(err);
                    // 있으면 카운트 증가
                    if (keyword) {
                        keyword.count += parseInt(dummies.DF[i]);
                        keyword.save(function (err, dbKeyword) {
                            if (err) return done(err);
                            if (!--len) done(null, null);
                        });
                    }
                    // 없으면 생성
                    else {
                        new Keyword({
                            noun: dummies.noun[i],
                            nounType: dummies.nounType[i],
                            count: dummies.DF[i]
                        })
                            .save(function (err, dbKeyword) {
                                if (err) return done(err);
                                if (!--len) done(null, null);
                            });
                    }
                });
            });
        }
    ], function (err) {
        // 데이터 리턴
        if (err) next(err);
        next();
    });
}, json);

module.exports = router;
