'use strict';

// Production 특성 설정
module.exports = {
    // 서버 IP
    ip: process.env.IP || undefined,

    // 서버 포트
    port: process.env.PORT || 8081,

    // 샘플 데이터 사용 여부(seed.js)
    seedDB: false,

    // MongoDB 옵션
    mongo: {
        uri: process.env.NODE_MONGO_DB || 'mongodb://not_yet_decided/breadcrumb'
    }
};
