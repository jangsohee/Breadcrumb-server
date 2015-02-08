'use strict';

var express = require('express'),
    controller = require('./history.controller'),
    auth = require('../../auth/auth.service'),
    json = require('../../components/protocol/json');

var router = express.Router();

// 히스토리 호출(하위 자식 트리 포함)
router.get('/:id', auth.isAuthenticated(), controller.get, json);
// 히스토리 생성
router.post('/', auth.isAuthenticated(), controller.create, json);
// 히스토리 등록
router.put('/:id', auth.isAuthenticated(), controller.update, json);
// 히스토리 위치 변경
router.put('/:id/shift', auth.isAuthenticated(), controller.shift, json);
// 히스토리 제거
router.delete('/:id', auth.isAuthenticated(), controller.remove, json);

module.exports = router;
