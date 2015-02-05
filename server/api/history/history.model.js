'use strict';

var _ = require('lodash'),
    mongoose = require('../../components/mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId,
    CODE = require('../../components/protocol/CODE');

var HistorySchema = new Schema({
    title: String,
    body: String,
    link: String,
    url: String,
    keyword: {
        type: ObjectId,
        ref: 'Keyword'
    },
    parent: {
        type: ObjectId,
        ref: 'History'
    },
    children: [
        {
            type: ObjectId,
            ref: 'History'
        }
    ],
    registered: {
        type: Date,
        required: CODE.HISTORY.REQUIRED_REGISTERED
    },
    deleted: Date
});

/**
 * Validations
 */

// 타이틀의 길이 검사
HistorySchema
    .path('title')
    .validate(function (title) {
        return _.isString(title) && title.length;
    }, CODE.HISTORY.MISSING_TITLE);
// 본문의 길이 검사
HistorySchema
    .path('body')
    .validate(function (body) {
        return _.isString(body) && body.length;
    }, CODE.HISTORY.MISSING_BODY);
// URL의 길이 검사
HistorySchema
    .path('url')
    .validate(function (url) {
        return _.isString(url) && url.length;
    }, CODE.HISTORY.MISSING_URL);


module.exports = mongoose.model('History', HistorySchema);
