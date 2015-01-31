'use strict';

var protocol = require('./components/protocol'),
    error = protocol.error,
    not_found = protocol.not_found,
    json = protocol.json,
    html = protocol.html;

/**
 * API 요청 경로별 분기 처리
 * @param app
 */
module.exports = function (app) {

    // 에러 발생시 공통 리턴
    app.use('/:url(api|auth)', not_found, error, json);

    // 리소스가 존재하지 않는 경우
    app.route('/:url(components|app|bower_components|assets)/**')
        .get(not_found, html);

    // 기본 리턴: index.html
    app.route('/*')
        .get(function (req, res) {
            res.sendfile(app.get('appPath') + '/index.html');
        });
};
