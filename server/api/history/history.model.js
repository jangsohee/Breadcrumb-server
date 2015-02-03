'use strict';

var _ = require('lodash'),
    mongoose = require('../../components/mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId,
    CODE = require('../../components/protocol/CODE');

var HistorySchema = new Schema({
    title: String,
    body: String,
    aTag: String,
    metaKeywords: [String],
    parentKeyword: {
        type: ObjectId,
        ref: 'Keyword'
    },
    majorKeyword: {
        type: ObjectId,
        ref: 'Keyword'
    },
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
// 에이 태그의 길이 검사
HistorySchema
    .path('aTag')
    .validate(function (aTag) {
        return _.isString(aTag) && aTag.length;
    }, CODE.HISTORY.MISSING_A_TAG);
// 메타 키워드의 길이 검사
HistorySchema
    .path('metaKeywords')
    .validate(function (metaKeywords) {
        return _.isArray(metaKeywords) && metaKeywords.length;
    }, CODE.HISTORY.MISSING_META_KEYWORDS);


module.exports = mongoose.model('History', HistorySchema);
