'use strict';

/**
 * API CODE list.
 */
var CODE = module.exports = {};

CODE.SUCCESS = {
    GET: {
        code: 0,
        status: 200,
        message: '성공'
    },
    SET: {
        code: 0,
        status: 201,
        message: '성공'
    }
};

CODE.COMMON = {
    ERROR: {
        code: 1,
        status: 400,
        message: '실패'
    },
    NOT_USE: {
        code: 2,
        status: 403,
        message: '해당 경로는 더 이상 사용되지 않습니다.'
    },
    NOT_FOUND: {
        code: 3,
        status: 404,
        message: '요청한 경로를 찾을 수 없습니다.'
    },
    FAULT_BACKEND: {
        code: 4,
        status: 404,
        message: '알 수 없는 오류가 발생했습니다.'
    },
    CAST_ERROR: {
        code: 5,
        status: 422,
        message: '잘못된 타입의 데이터가 전달되었습니다.'
    },
    MISSING_CREDENTIALS: {
        code: 11,
        status: 422,
        message: '필수 데이터가 누락되었습니다.'
    }
};