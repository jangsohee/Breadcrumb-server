'use strict';

var express = require('express'),
    controller = require('./user.controller'),
    auth = require('../../auth/auth.service'),
    json = require('../../components/protocol/json');

var router = express.Router();

// 회원 가입
router.post('/', controller.create, json);
// 회원 탈퇴
router.delete('/', auth.isAuthenticated(), controller.remove, json);
module.exports = router;
