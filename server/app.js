/**
 * Main application file
 */

'use strict';

// 노드 환경 변수 설정 초기화
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express'),
    mongoose = require('mongoose'),
    config = require('./config/environment');

// 데이터베이스 연결
mongoose.connect(config.mongo.uri, config.mongo.options);

// 샘플 데이터 사용
if (config.seedDB) require('./config/seed');

// 서버 생성
var app = express(),
    server = require('http').createServer(app);

// 서버 기본 설정
require('./config/auth.token')();		// Set authentication token

// 익스프레스 설정 및 라우트
require('./config/express')(app);
require('./routes')(app);

// 서버 시작
server.listen(config.port, config.ip, function () {
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});
