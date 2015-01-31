'use strict';

module.exports = function (req, res) {
    res.sendStatus(res._code.status);
};
