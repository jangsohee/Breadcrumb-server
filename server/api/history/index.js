'use strict';

var express = require('express'),
    controller = require('./history.controller'),
    auth = require('../../auth/auth.service'),
    json = require('../../components/protocol/json');

var router = express.Router();

// 히스토리 생성
router.post('/', auth.hasApplication(), controller.create, json);

module.exports = router;
