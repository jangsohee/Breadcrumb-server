'use strict';

var Application = require('./application.model'),       // 어플리케이션 모델
    CODE = require('../../components/protocol/CODE'),   // 프로토콜 코드
    CommonError = require('../../components/error');    // 공통 에러

/**
 * 어플리케이션 생성
 *
 * @param callback
 */
module.exports.create = function (callback) {
    // 콜백이 존재하지 않을 시 에러 리턴
    if (!callback) throw new CommonError(CODE.COMMON.REQUIRED_CALLBACK);
    new Application({}).save(callback);
};

/**
 * 어플리케이션 도큐먼트의 루트 히스토리 목록에 히스토리 추가
 *
 * @param id 어플리케이션 오브젝트 아이디
 * @param historyId 추가할 히스토리 오브젝트 아이디
 * @param callback
 */
module.exports.addHistory = function (id, historyId, callback) {
    // 콜백이 존재하지 않을 시 에러 리턴
    if (!callback) throw new CommonError(CODE.COMMON.REQUIRED_CALLBACK);
    // 루트 히스토리 목록에 추가(유일)
    Application.findByIdAndUpdate(id, {$addToSet: {rootHistories: historyId}}, callback);
};

/**
 * 어플리케이션 도큐먼트의 루트 히스토리 목록 중 하나 제거
 *
 * @param id 어플리케이션 오브젝트 아이디
 * @param historyId 추가할 히스토리 오브젝트 아이디
 * @param callback
 */
function removeHistory (id, historyId, callback) {
    // 콜백이 존재하지 않을 시 에러 리턴
    if (!callback) throw new CommonError(CODE.COMMON.REQUIRED_CALLBACK);
    // 루트 히스토리 목록에서 제거
    Application.findByIdAndUpdate(id, {$pull: {rootHistories: historyId}}, callback);
}
module.exports.removeHistory = removeHistory;

/**
 * 루트 배열 순서 변경
 *
 * @param id 어플리케이션 오브젝트 아이디
 * @param historyId 추가할 히스토리 오브젝트 아이디
 * @param index 추가할 위치 인덱스 값
 * @param callback
 */
module.exports.shiftHistory = function (id, historyId, index, callback) {
    // 콜백이 존재하지 않을 시 에러 리턴
    if (!callback) throw new CommonError(CODE.COMMON.REQUIRED_CALLBACK);
    // 기존 목록에서 히스토리 제거
    removeHistory(id, historyId, function (err, app) {
        // 에러 처리
        if (err) return callback(err);
        // 어플리케이션이 없을 시, 에러 처리
        if (!app) return callback(CODE.APPLICATION.NOT_FOUND);
        // 해당 위치에 히스토리 추가
        app.rootHistories.splice(index, 0, historyId);
        // 저장 후 콜백 실행
        app.save(callback);
    });
};