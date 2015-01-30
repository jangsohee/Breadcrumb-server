'use strict';

var path = require('path'),
    _ = require('lodash');

// 기본 프로젝트 설정
var all = {
    env: process.env.NODE_ENV,

    // 서버의 루트 경로
    root: path.normalize(__dirname + '/../../..'),

    // 서버 포트
    port: process.env.PORT || 9000,

    // 샘플 데이터 사용 여부(seed.js)
    seedDB: false,

    // MongoDB 옵션
    mongo: {
        options: {
            db: {
                safe: true
            }
        }
    },

    // 가입 회원 구분
    userRoles: ['guest', 'user', 'editor', 'admin']
};

// 노드 실행 형태에 따른 설정 데이터 통합
module.exports = _.merge(
    all,
    require('./' + process.env.NODE_ENV + '.js') || {});
