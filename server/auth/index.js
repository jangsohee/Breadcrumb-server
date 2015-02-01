'use strict';

var express = require('express'),
    User = require('../api/user/user.model'),
    config = require('../config/environment');

// Passport Configuration
require('./local/passport').setup(User, config);

var router = express.Router();

router.use('/local', require('./local'));

module.exports = router;