'use strict';

var _ = require('lodash'),
    async = require('async'),
    History = require('./history.model'),
    historyPop = require('./history.populate'),
    CODE = require('../../components/protocol/CODE'),
    CommonError = require('../../components/error');

/**
 * 히스토리 재귀 호출
 * @param histories 자식 히스토리 배열
 * @param callback
 */
function walk(histories, callback) {
    // 콜백이 존재하지 않을 시 에러 리턴
    if (!callback) throw new CommonError(CODE.COMMON.REQUIRED_CALLBACK);
    // 재귀 호출 분기처리를 위한 length
    var len = histories.length;
    if (len) {
        // TODO #1: 히스토리 데이터 바인딩
        _.forEach(histories, function (history, i) {
            // 히스토리 검색
            History
                .findById(history._id, historyPop.select)
                // keyword, children 도큐먼트 데이터 포함
                .populate([/*historyPop.keyword,*/ historyPop.children])
                .exec(function (err, populatedHistory) {
                    // 에러 처리
                    if (err) return callback(err);
                    // 파퓰레이트 된 데이터로 변경
                    histories[i] = populatedHistory;
                    // TODO #2: 자식 목록 재귀 호출
                    walk(histories[i].children, function (err, children) {
                        // 에러 처리
                        if (err) return callback(err);
                        // 부모 히스토리에 자식 데이터 바인딩
                        histories[i].children = children;
                        // 다음 자식이 존재하지 않는 경우, 콜백
                        if (!--len) callback(null, histories);
                    });
                });
        });
    }
    // 자식이 존재하지 않는 경우, 콜백
    else callback(null, histories);
}
module.exports.walk = walk;

/**
 * 히스토리를 이동 시킬 위치 검증
 *  - 히스토리는 자기 자신의 하부로 옮겨질 수 없다.
 * @param PARENT_ID 옮기고자 하는 부모 히스토리 오브젝트 아이디
 * @param histories 자식 히스토리 배열
 * @param callback
 */
function search (PARENT_ID, histories, callback) {
    // 콜백이 존재하지 않을 시 에러 리턴
    if (!callback) throw new CommonError(CODE.COMMON.REQUIRED_CALLBACK);
    // 재귀 호출 분기처리를 위한 length
    var len = histories.length;
    if (len) {
        // TODO #1: 히스토리 데이터 검색
        _.forEach(histories, function (history, i) {
            // 히스토리 검색
            History
                .findById(history, historyPop.select)
                // children 도큐먼트 데이터 포함
                .populate([historyPop.children])
                .exec(function (err, populatedHistory) {
                    // 에러 처리
                    if (err) return callback(err);
                    // 변경하고자 하는 부모 아이디가 자식이라면 에러 처리
                    if (PARENT_ID === populatedHistory._id.toString())
                        return callback(CODE.HISTORY.SHIFT_TO_CHILD);
                    // TODO #2: 자식 목록 재귀 탐색
                    search(PARENT_ID, populatedHistory.children, function (err, children) {
                        // 에러 처리
                        if (err) return callback(err);
                        // 다음 자식이 존재하지 않는 경우, 콜백
                        if (!--len) callback(null, histories);
                    });
                });
        });
    }
    // 자식이 존재하지 않는 경우, 콜백
    else callback(null, histories);
}
module.exports.search = search;

/**
 * 히스토리 하위 모든 자식 제거
 *
 * @param id 자식을 제거할 히스토리
 * @param callback
 */
function remove (id, callback) {
    // 콜백이 존재하지 않을 시 에러 리턴
    if (!callback) throw new CommonError(CODE.COMMON.REQUIRED_CALLBACK);
    // 히스토리 검색
    History
        .findById(id)
        .exec(function (err, history) {
            // 에러 처리
            if (err) return callback(err);
            // 히스토리가 없으면 안되지만, 상관 없으므로 그냥 리턴.
            if (!history) return callback();
            // 자식 배열 길이에 따른 분기
            var childLen = _.isArray(history.children) ? history.children.length : 0;
            // 자식이 있는 경우,
            if (childLen) {
                // 자식별 분기 처리
                async.each(history.children, function (childId, done) {
                    // 재귀 호출
                    remove(childId, function (err) {
                        // 에러 처리
                        if (err) return done(err);
                        // 모든 재귀가 완료되면 콜백
                        done();
                    });
                }, function (err) {
                    // 에러 처리
                    if (err) return callback(err);
                    // 히스토리 제거 후, 콜백 실행
                    History.remove({_id: id}, callback);
                });
            }
            // 자식이 없는 경우,
            else {
                // 히스토리 제거 후, 콜백 실행
                History.remove({_id: id}, callback);
            }
        });
}
module.exports.remove = remove;

/**
 * 자식 추가
 * @param id 대상 히스토리
 * @param childId 자식 히스토리 아이디
 * @param callback
 */
module.exports.addChild = function (id, childId, callback) {
    // 콜백이 존재하지 않을 시 에러 리턴
    if (!callback) throw new CommonError(CODE.COMMON.REQUIRED_CALLBACK);
    // 자식 히스토리 목록에 추가(유일)
    History.findByIdAndUpdate(id, {$addToSet: {children: childId}}, callback);
};

/**
 * 자식 제거
 * @param id 대상 히스토리
 * @param childId 자식 히스토리 아이디
 * @param callback
 */
function removeChild(id, childId, callback) {
    // 콜백이 존재하지 않을 시 에러 리턴
    if (!callback) throw new CommonError(CODE.COMMON.REQUIRED_CALLBACK);
    // 자식 히스토리 목록에서 제거
    History.findByIdAndUpdate(id, {$pull: {children: childId}}, callback);
}
module.exports.removeChild = removeChild;

/**
 * 자식 배열 순서 변경
 * @param id 대상 히스토리
 * @param childId 자식 히스토리 아이디
 * @param index 옮길 인덱스 값
 * @param callback
 */
module.exports.shiftChild = function (id, childId, index, callback) {
    // 콜백이 존재하지 않을 시 에러 리턴
    if (!callback) throw new CommonError(CODE.COMMON.REQUIRED_CALLBACK);
    // 기존 목록에서 히스토리 제거
    removeChild(id, childId, function (err, history) {
        // 에러 처리
        if (err) return callback(err);
        // 히스토리가 없을 시, 에러 처리
        if (!history) return callback(CODE.HISTORY.NOT_FOUND);
        // 해당 위치에 히스토리 추가
        history.children.splice(index, 0, childId);
        // 저장 후 리턴
        history.save(callback);
    });
};

/**
 * 특정 위치에 자식 추가
 * @param id 대상 히스토리
 * @param childId 자식 히스토리 아이디
 * @param index 추가할 위치 인덱스 값
 * @param callback
 */
module.exports.addChildIdx = function (id, childId, index, callback) {
    // 콜백이 존재하지 않을 시 에러 리턴
    if (!callback) throw new CommonError(CODE.COMMON.REQUIRED_CALLBACK);
    // 부모 히스토리 도큐먼트 검색
    History.findById(id, function (err, parent) {
        // 에러 처리
        if (err) return callback(err);
        // 부모가 없으면 에러 처리
        if (!parent) return callback(CODE.HISTORY.INVALID_PARENT);
        // 부모의 자식에 이미 해당 히스토리가 존재한다면 에러 처리
        if (parent.children.indexOf(childId) !== -1)
            return callback(CODE.HISTORY.DUPLICATED_CHILDREN);
        // 부모의 자식 배열의 해당 인덱스 위치에 히스토리 추가
        parent.children.splice(index, 0, childId);
        // 부모 저장 후 콜백
        parent.save(callback);
    });
};