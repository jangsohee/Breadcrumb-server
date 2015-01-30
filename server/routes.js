'use strict';

/**
 * API 요청 경로별 분기 처리
 * @param app
 */
module.exports = function (app) {

    // 기본 리턴: index.html
    app.route('/*')
        .get(function (req, res) {
            res.sendfile(app.get('appPath') + '/index.html');
        });
};
