'use strict';

var mongoose = require('../../components/mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId,
    CODE = require('../../components/protocol/CODE');

var KeywordSchema = new Schema({
    history: {
        type: ObjectId,
        ref: 'History'
    },
    name: String,
    count: {
        type: Number,
        default: 0
    },
    registered: {
        type: Date,
        required: CODE.KEYWORD.REQUIRED_REGISTERED
    },
    deleted: Date
});


module.exports = mongoose.model('Keyword', KeywordSchema);
