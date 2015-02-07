'use strict';

var _ = require('lodash'),
    async = require('async'),
    History = require('./history.model'),
    historyService = require('./history.service'),
    applicationService = require('../application/application.service'),
    historyPop = require('./history.populate'),
    CODE = require('../../components/protocol/CODE');

/**
 * 히스토리 호출(하위 자식 트리 포함)
 *
 * @param req
 * @param res
 * @param next
 */
module.exports.get = function (req, res, next) {
    // 히스토리 검색
    History
        // 기본 정보만 출력
        .findById(req.params.id, historyPop.select)
        // 자식 도큐먼트 파퓰레이트
        .populate([historyPop.children])
        .exec(function (err, history) {
            // 에러 처리
            if (err) return next(err);
            // 히스토리가 없어도 에러 처리
            if (!history) return next(CODE.HISTORY.NOT_FOUND);
            // 자식 도큐먼트 재귀 호출
            historyService.walk(history.children, function (err, histories) {
                // 에러 처리
                if (err) return next(err);
                // 리턴 데이터 등록
                res._data = history;
                // 함수 종료(다음 함수 호출)
                next();
            });
        });
};

/**
 * 히스토리 생성
 *  - 아이디만 생성해 리턴한다.
 * @param req
 * @param res
 * @param next
 */
module.exports.create = function (req, res, next) {
    // TODO #1: 히스토리 생성
    new History({
        // 현재 시간 등록
        registered: new Date()
    })
        .save(function (err, history) {
            // TODO #2: 데이터 리턴
            // 에러 처리
            if (err) return next(err);
            // 리턴 데이터 설정
            res._data = history;
            // 함수 종료(다음 함수 호출)
            next();
        });
};

/**
 * 히스토리 등록(데이터 입력은 1회만 가능하다.)
 *  - 크롬 익스텐션으로 부터 히스토리 정보를 받는다.
 *  - 키워드 분석 애드온을 사용하여 키워드를 추출한다.(미구현)
 *  - 키워드와 함께 히스토리를 크롬 익스텐션에 리턴한다.
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
module.exports.update = function (req, res, next) {
    // TODO #0: 기본 변수 설정
    if (req.body._id) delete req.body._id;          // _id는 업데이트시 위험 요소이므로, 제거
    var applicationId = req.currentApplication,     // 헤더에서 뽑은 어플리케이션 아이디
        historyId = req.params.id,                  // 파라미터로 받은 해당 히스토리 아이디
        newHistory = req.body,                      // JSON으로 받은 히스토리 데이터
        pass = {                                    // 롤백 처리를 위한 플래그 오브젝트
            app: false,
            parent: false
        };
    // 히스토리 밸리데이션 체크
    if (!newHistory.title) return next(CODE.HISTORY.MISSING_TITLE);
    if (!newHistory.body) return next(CODE.HISTORY.MISSING_BODY);
    if (!newHistory.url) return next(CODE.HISTORY.MISSING_URL);
    // 히스토리 부모 값 정리
    if (newHistory.parent) newHistory.parent = newHistory.parent._id || newHistory.parent;

    // TODO #1: 히스토리 찾기
    History.findById(historyId, function (err, history) {
        // 에러 처리
        if (err) return next(err);
        // 히스토리가 없어도 에러 처리
        if (!history) return next(CODE.HISTORY.NOT_FOUND);
        // 이미 데이터가 등록된 경우 에러처리
        if (history.updated) return next(CODE.HISTORY.UPDATED);
        // 순차적 처리를 위한 waterfall 함수
        async.waterfall([
            // TODO #2: 자식 배열에 등록
            function (callback) {
                if (newHistory.parent) {
                    // 부모 존재시, 부모의 자식으로 등록
                    History.findByIdAndUpdate(newHistory.parent, {$addToSet: {children: historyId}}, function (err, parent) {
                        // 에러 처리
                        if (err) return callback(err);
                        // 부모가 없으면 에러 처리
                        if (!parent) return callback(CODE.HISTORY.INVALID_PARENT);
                        // 롤백을 위한 변수 값 변경
                        pass.parent = true;
                        // 함수 종료(다음 함수 호출)
                        callback();
                    });
                } else {
                    // 부모가 없을시, 어플 계정에 루트 히스토리 추가
                    applicationService.addHistory(applicationId, historyId, function (err, app) {
                        // 에러 처리
                        if (err) return callback(err);
                        // 어플리케이션이 없으면 에러 처리
                        if (!app) return callback(CODE.APPLICATION.NOT_FOUND);
                        // 롤백을 위한 변수 값 변경
                        pass.app = true;
                        // 함수 종료(다음 함수 호출)
                        callback();
                    });
                }
            },
            // TODO #3: 히스토리 데이터 변경
            function (callback) {
                // 기존 히스토리에 데이터 입력
                history.updated = new Date();           // 업데이트 설정
                // 데이터 병합 후 저장 > 콜백
                _.merge(history, newHistory)
                    .save(function (err, history) {
                        // 에러 처리
                        if (err) {
                            // 부모에 정상적으로 추가된 경우,
                            if (pass.parent) {
                                // 부모에 추가된 자식 히스토리 데이터 롤백
                                historyService.removeChild(newHistory.parent, historyId, function (err, parent) {
                                    // 롤백은 리턴과 관계 없음.
                                });
                            }
                            // 어플리케이션의 루트 히스토리로 추가된 경우,
                            else if (pass.app) {
                                // 어플리케이션에 추가된 루트 히스토리 데이터 롤백
                                applicationService.removeHistory(applicationId, historyId, function (err, app) {
                                    // 롤백은 리턴과 관계 없음.
                                });
                            }
                            return callback(err);
                        }
                        // 데이터와 함께 콜백 실행
                        callback(null, history);
                    });
            }
            // TODO #4: 데이터 리턴
        ], function (err, history) {
            // 에러 처리
            if (err) return next(err);
            // 리턴 데이터 설정
            res._data = history;
            // 함수 종료(다음 함수 호출)
            next();
        });
    });
};

/**
 * 히스토리 위치 변경
 * 필요 데이터
 *  - parent: 부모 히스토리의 아이디(선택)
 *  - index: 해당 히스토리의 인덱스 값(필수)
 * 경우의 수
 *  - 부모 값과 인덱스 값이 바뀐다.
 *  - 인덱스 값만 바뀐다.
 * 고려사항
 *  - 현재 히스토리가 루트 히스토리이다.
 *  - 옮길 히스토리가 루트 히스토리이다.
 * 주의사항
 *  - 자식 히스토리 하부로 옮기면 트리구조가 꼬인다.(당연)
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
module.exports.shift = function (req, res, next) {
    // TODO #0: 기본 변수 설정
    if (req.body._id) delete req.body._id;          // _id는 업데이트시 위험 요소이므로, 제거
    var applicationId = req.currentApplication,     // 헤더에서 뽑은 어플리케이션 아이디
        historyId = req.params.id,                  // 파라미터로 받은 해당 히스토리 아이디
        newHistory = {                              // 폼 데이터를 통해 받은 히스토리 위치 변경 값
            parent: req.body.parent,                // 부모 히스토리 오브젝트 아이디
            index: req.body.index || 0              // index는 필수 이므로 누락시 추가
        };

    // 순차적 처리를 위한 waterfall 함수
    async.waterfall([
        // TODO #1: 기존 히스토리 호출
        function (callback) {
            // 아이디로 히스토리 도큐먼트 검색
            History.findById(historyId, function (err, history) {
                // 에러 처리
                if (err) return callback(err);
                // 히스토리가 없어도 에러 처리
                if (!history) return next(CODE.HISTORY.NOT_FOUND);
                // 다음 waterfall 함수로 데이터 전달
                callback(null, history);
            });
        },
        // TODO #2: 히스토리 이동 위치 검증
        function (history, callback) {
            // 새 부모가 존재할 경우,
            if (newHistory.parent) {
                // 새 부모가 유효한 위치인지 검증
                historyService.search(newHistory.parent, history.children, function (err) {
                    // 에러 처리
                    if (err) return callback(err);
                    // 다음 waterfall 함수로 데이터 전달
                    callback(null, history);
                });
            }
            // 새 부모가 존재하지 않을 경우, 패스
            else callback(null, history);
        },
        // TODO #2: 케이스별 히스토리 변경
        function (history, callback) {
            // 기존 히스토리가 루트인 경우,
            if (!history.parent) {
                // TODO #2 case 1: 루트 히스토리에서 다른 히스토리의 자식으로 변경된 경우,
                // 새로운 히스토리에 부모가 있는 경우(더 이상 루트가 아닌 경우),
                if (newHistory.parent) {
                    // 빠른 처리를 위한 병렬 처리
                    async.parallel([
                        // 어플리케이션의 루트 히스토리 목록에서 해당 히스토리 제거
                        function (callback2) {
                            // 어플리케이션 서비스 모듈을 통한 루트 히스토리 에서 해당 히스토리 제거
                            applicationService.removeHistory(applicationId, history._id, function (err, app) {
                                // 에러 처리
                                if (err) return callback2(err);
                                // 함수 종료(콜백 실행)
                                callback2();
                            });
                        },
                        // 새로운 부모의 자식 목록에 추가(해당 인덱스 위치로)
                        function (callback2) {
                            historyService.addChildIdx(newHistory.parent, historyId, newHistory.index, function (err, parent) {
                                // 에러 처리
                                if (err) return callback2(err);
                                // 함수 종료(콜백 실행)
                                callback2();
                            });
                        },
                        // 히스토리 변경사항 업데이트
                        function (callback2) {
                            // 부모 히스토리 아이디 변경
                            History.findByIdAndUpdate(historyId, {parent: newHistory.parent}, function (err, history) {
                                // 에러 처리
                                if (err) return callback2(err);
                                // 함수 종료(콜백 실행)
                                callback2();
                            });
                        }
                        // 병렬 처리 완료후 실행 함수
                    ], function (err) {
                        // 에러 처리
                        if (err) return callback(err);
                        // 함수 종료(다음 함수 호출)
                        callback();
                    });
                }
                // TODO #2 case 2: 새로운 히스토리에도 부모가 없는 경우(그대로 루트이며 위치만 변경된 경우),
                else {
                    // 어플리케이션의 루트 히스토리 목록의 순서 변경.
                    applicationService.shiftHistory(applicationId, historyId, newHistory.index, function (err, app) {
                        // 에러 처리
                        if (err) return callback(err);
                        // 함수 종료(다음 함수 호출)
                        callback();
                    });
                }
            }
            // 기존 히스토리가 루트가 아닌 경우,
            else {
                // 새로운 히스토리에 부모가 있는 경우,
                if (newHistory.parent) {
                    // TODO #2 case 3: 새로운 히스토리의 부모가 기존 히스토리의 부모와 같은 경우(부모가 그대로이며 위치만 바뀐 경우),
                    if (newHistory.parent === history.parent.toString()) {
                        // 부모의 자식 히스토리 목록의 순서 변경
                        historyService.shiftChild(history.parent, historyId, newHistory.index, function (err, parent) {
                            // 에러 처리
                            if (err) return callback(err);
                            // 함수 종료(다음 함수 호출)
                            callback();
                        });
                    }
                    // TODO #2 case 4: 새로운 히스토리의 부모가 기존 히스토리의 부모와 다른 경우(새 부모로 바뀐 경우),
                    else {
                        // 빠른 처리를 위한 병렬 처리
                        async.parallel([
                            // 기존 부모 히스토리의 자식 목록에서 해당 히스토리 제거
                            function (callback2) {
                                historyService.removeChild(history.parent, historyId, function (err, parent) {
                                    // 에러 처리
                                    if (err) return callback2(err);
                                    // 부모가 없으면 에러 처리
                                    if (!parent) return callback2(CODE.HISTORY.INVALID_PARENT);
                                    // 함수 종료(콜백 실행)
                                    callback2();
                                });
                            },
                            // 새로운 부모의 자식 목록에 추가(해당 인덱스 위치로)
                            function (callback2) {
                                historyService.addChildIdx(newHistory.parent, historyId, newHistory.index, function (err, parent) {
                                    // 에러 처리
                                    if (err) return callback2(err);
                                    // 함수 종료(콜백 실행)
                                    callback2();
                                });
                            },
                            // 히스토리 변경사항 업데이트
                            function (callback2) {
                                // 부모 히스토리 아이디 변경
                                History.findByIdAndUpdate(historyId, {parent: newHistory.parent}, function (err, history) {
                                    // 에러 처리
                                    if (err) return callback2(err);
                                    // 함수 종료(콜백 실행)
                                    callback2();
                                });
                            }
                            // 병렬 처리 완료후 실행 함수
                        ], function (err) {
                            // 에러 처리
                            if (err) return callback(err);
                            // 함수 종료(다음 함수 호출)
                            callback();
                        });
                    }
                }
                // TODO #2 case 5: 새로운 히스토리에 부모가 없는 경우(루트로 변경된 경우),
                else {
                    // 빠른 처리를 위한 병렬 처리
                    async.parallel([
                        // 어플리케이션의 루트 히스토리에 추가
                        function (callback2) {
                            applicationService.addHistory(applicationId, history._id, function (err, app) {
                                // 에러 처리
                                if (err) return callback2(err);
                                // 어플리케이션이 없으면 에러 처리
                                if (!app) return callback2(CODE.APPLICATION.NOT_FOUND);
                                // 함수 종료(콜백 실행)
                                callback2();
                            });
                        },
                        // 부모 히스토리에서 자식 제거
                        function (callback2) {
                            historyService.removeChild(history.parent, history._id, function (err, parent) {
                                // 에러 처리
                                if (err) return callback2(err);
                                // 부모가 없으면 에러 처리
                                if (!parent) return callback2(CODE.HISTORY.INVALID_PARENT);
                                // 함수 종료(콜백 실행)
                                callback2();
                            });
                        },
                        // 부모 제거
                        function (callback2) {
                            History.findByIdAndUpdate(history._id, {$unset: {parent: 1}}, function (err, history) {
                                // 에러 처리
                                if (err) return callback2(err);
                                // 함수 종료(콜백 실행)
                                callback2();
                            });
                        }
                        // 병렬 처리 완료후 실행 함수
                    ], function (err) {
                        // 에러 처리
                        if (err) return callback(err);
                        // 함수 종료(다음 함수 호출)
                        callback();
                    });
                }
            }
        }
        // TODO #3: 데이터 리턴
    ], function (err) {
        // 에러 처리
        if (err) return next(err);
        // 함수 종료(다음 함수 호출)
        next();
    });
};


module.exports.remove = function (req, res, next) {
    // TODO #0: 기본 변수 설정
    if (req.body._id) delete req.body._id;          // _id는 업데이트시 위험 요소이므로, 제거
    var applicationId = req.currentApplication,     // 헤더에서 뽑은 어플리케이션 아이디
        historyId = req.params.id;                  // 파라미터로 받은 해당 히스토리 아이디

    // TODO: #1: 히스토리 찾기
    History.findById(historyId, function (err, history) {
        // 에러 처리
        if (err) return next(err);
        // 히스토리가 없어도 에러 처리
        if (!history) return next(CODE.HISTORY.NOT_FOUND);
        // 빠른 처리를 위한 병렬 처리
        async.parallel([
            // TODO #2: 부모 히스토리에서 해당 자식 제거
            function (callback) {
                // TODO #2 case 1: 부모가 존재하는 경우,
                if (history.parent) {
                    historyService.removeChild(history.parent, historyId, function (err, parent) {
                        // 에러 처리
                        if (err) return callback(err);
                        // 부모가 없으면 에러 처리
                        if (!parent) return callback(CODE.HISTORY.INVALID_PARENT);
                        // 함수 종료(콜백 실행)
                        callback();
                    });
                }
                // TODO #2 case 2: 부모가 존재하지 않은 경우(루트 히스토리인 경우),
                else {
                    applicationService.removeHistory(applicationId, historyId, function (err, app) {
                        // 에러 처리
                        if (err) return callback(err);
                        // 어플리케이션이 없으면 에러 처리
                        if (!app) return callback(CODE.APPLICATION.NOT_FOUND);
                        // 함수 종료(콜백 실행)
                        callback();
                    });
                }
            },
            // TODO #3: 히스토리 제거(자식/후손 포함)
            function (callback) {
                historyService.remove(historyId, function (err) {
                    // 에러 처리
                    if (err) return callback(err);
                    // 함수 종료(콜백 실행)
                    callback();
                });
            }
            // TODO #4: 데이터 리턴
        ], function (err) {
            // 에러 처리
            if (err) return next(err);
            // 함수 종료(다음 함수 호출)
            next();
        });
    });
};