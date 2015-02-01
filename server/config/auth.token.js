'use strict';

var fs = require('fs'),
	path = require('path'),
	config = require('./environment');

module.exports = function () {
	module.exports = {
		cert: fs.readFileSync(path.join(config.root, '/server/config/auth/token-cert.pem'), 'utf-8'),
		key: fs.readFileSync(path.join(config.root, '/server/config/auth/token-key.pem'), 'utf-8')
	};
};
