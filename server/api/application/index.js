'use strict';

var express = require('express'),
    controller = require('./application.controller'),
    auth = require('../../auth/auth.service'),
    json = require('../../components/protocol/json');

var router = express.Router();

// 어플리케이션 데이터 호출
router.get('/', auth.isAuthenticated(), controller.get, json);

module.exports = router;
