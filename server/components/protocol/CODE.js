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
    CASTING: {
        code: 5,
        status: 422,
        message: '잘못된 타입의 데이터가 전달되었습니다.'
    },
    MISSING_CREDENTIALS: {
        code: 11,
        status: 422,
        message: '필수 데이터가 누락되었습니다.'
    },
    REQUIRED_CALLBACK: {
        code: 21,
        status: 500,
        message: 'Missing callback function arguments.'
    }
};

CODE.AUTH = {
    INVALID_TOKEN: {
        code: 10101,
        status: 401,
        message: '액세스 토큰이 유효하지 않습니다.'
    },
    EXPIRED_TOKEN: {
        code: 10102,
        status: 401,
        message: '액세스 토큰이 만료되었습니다.'
    },
    AUTHORIZATION_FORMAT: {
        code: 10103,
        status: 401,
        message: '액세스 토큰의 타입이 잘못되었습니다.'
    },
    AUTHORIZATION_HEADER: {
        code: 10104,
        status: 401,
        message: '인증 헤더 정보가 존재하지 않습니다.'
    },
    PERMISSION_DENIED: {
        code: 10105,
        status: 403,
        message: '접근 권한이 없습니다.'
    },
    APPLICATION_HEADER: {
        code: 10111,
        status: 403,
        message: '어플리케이션 헤더가 정보가 존재하지 않습니다.'
    },
    MISSING_SECRET: {
        code: 20101,
        status: 500,
        message: 'Secret key was not loaded.'
    },
    LOCAL_VERIFY: {
        code: 20102,
        status: 500,
        message: 'Local authentication strategy requires a verify function'
    }
};

CODE.USER = {
    NOT_FOUND: {
        code: 10201,
        status: 404,
        message: '해당 유저를 찾을 수 없습니다.'
    },
    UNREGISTERED: {
        code: 10202,
        status: 401,
        message: '등록되지 않은 계정입니다.'
    },
    MISSING_EMAIL: {
        code: 10211,
        status: 422,
        message: '이메일이 누락되었습니다.'
    },
    INVALID_EMAIL: {
        code: 10212,
        status: 422,
        message: '이메일의 형식이 유효하지 않습니다.'
    },
    DUPLICATE_EMAIL: {
        code: 10213,
        status: 422,
        message: '이미 사용중인 이메일입니다.'
    },
    MISSING_PASSWORD: {
        code: 10214,
        status: 422,
        message: '비밀번호가 누락되었습니다.'
    },
    SHORT_PASSWORD: {
        code: 10215,
        status: 422,
        message: '비밀번호가 너무 짧습니다.'
    },
    INCORRECT_PASSWORD: {
        code: 10216,
        status: 403,
        message: '잘못된 비밀번호가 입력되었습니다.'
    },
    MISSING_NICKNAME: {
        code: 10217,
        status: 422,
        message: '닉네임이 누락되었습니다.'
    },
    REQUIRED_ROLE: {
        code: 20201,
        status: 500,
        message: 'Set `role` before save `User` document.'
    },
    REQUIRED_REGISTERED: {
        code: 20202,
        status: 500,
        message: 'Set `registered` before save `User` document.'
    },
    SET_ROLE: {
        code: 20203,
        status: 500,
        message: 'Set `role` before check authentication.'
    }
};

CODE.APPLICATION = {
    NOT_FOUND: {
        code: 10301,
        status: 404,
        message: '해당 어플리케이션을 찾을 수 없습니다.'
    },
    REQUIRED_REGISTERED: {
        code: 20301,
        status: 500,
        message: 'Set `registered` before save `Application` document.'
    }
};

CODE.HISTORY = {
    NOT_FOUND: {
        code: 10401,
        status: 404,
        message: '해당 히스토리를 찾을 수 없습니다.'
    },
    UPDATED: {
        code: 10402,
        status: 403,
        message: '해당 히스토리의 데이터는 이미 처리되었습니다.'
    },
    INVALID_PARENT: {
        code: 10403,
        status: 404,
        message: '유효하지 않은 부모 히스토리 오브젝트 아이디입니다.'
    },
    DUPLICATED_CHILDREN: {
        code: 10404,
        status: 405,
        message: '해당 자식 히스토리는 이미 배열에 포함되어 있습니다.'
    },
    SHIFT_TO_CHILD: {
        code: 10404,
        status: 405,
        message: '히스토리를 자기 자신의 하부로 옮길 수 없습니다.'
    },
    MISSING_TITLE: {
        code: 10411,
        status: 422,
        message: '타이틀이 누락되었습니다.'
    },
    MISSING_BODY: {
        code: 10412,
        status: 422,
        message: '본문이 누락되었습니다.'
    },
    MISSING_URL: {
        code: 10413,
        status: 422,
        message: 'URL이 누락되었습니다.'
    },
    REQUIRED_REGISTERED: {
        code: 20401,
        status: 500,
        message: 'Set `registered` before save `Application` document.'
    }
};

CODE.KEYWORD = {
    REQUIRED_APPLICATION: {
        code: 20501,
        status: 500,
        message: 'Set `application` before save `Application` document.'
    },
    REQUIRED_NOUN: {
        code: 20502,
        status: 500,
        message: 'Set `noun` before save `Application` document.'
    },
    REQUIRED_NOUN_TYPE: {
        code: 20503,
        status: 500,
        message: 'Set `nounType` before save `Application` document.'
    },
    REQUIRED_REGISTERED: {
        code: 20504,
        status: 500,
        message: 'Set `registered` before save `Application` document.'
    }
};