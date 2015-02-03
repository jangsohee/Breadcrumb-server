'use strict';

var express = require('express'),
    controller = require('./application.controller'),
    auth = require('../../auth/auth.service'),
    json = require('../../components/protocol/json');

var router = express.Router();

// 어플 계정 생성
router.post('/', auth.getCurrentApp, controller.create, json);

module.exports = router;
