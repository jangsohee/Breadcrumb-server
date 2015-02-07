'use strict';

var _ = require('lodash'),
    mongoose = require('../../components/mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId,
    CODE = require('../../components/protocol/CODE');

var HistorySchema = new Schema({
    title: String,              // 제목 스트링
    body: String,               // 본문 스트링
    link: String,               // 링크 스트링(선택)
    url: String,                // URL 스트링
    keyword: {                  // 키워드 오브젝트 아이디
        type: ObjectId,
        ref: 'Keyword'
    },
    parent: {                   // 부모 히스토리 오브젝트 아이디(존재시)
        type: ObjectId,
        ref: 'History'
    },
    children: [                 // 자식 히스토리 오브젝트 아이디 배열
        {
            type: ObjectId,
            ref: 'History'
        }
    ],
    registered: {               // 히스토리 생성일시
        type: Date,
        required: CODE.HISTORY.REQUIRED_REGISTERED
    },
    updated: Date               // 히스토리 데이터 입력일시
});

module.exports = mongoose.model('History', HistorySchema);
