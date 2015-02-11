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
    // 인증
    app.use('/auth', require('./auth'));

    // API
    // 유저
    app.use('/api/users', require('./api/user'));
    // 어플리케이션
    app.use('/api/apps', require('./api/application'));
    // 히스토리
    app.use('/api/histories', require('./api/history'));
    // 키워드 샘플
    app.use('/sample/keywords', require('./api/keyword/sample'));

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
