'use strict';

var mongoose = require('../../components/mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId,
    CODE = require('../../components/protocol/CODE');

var KeywordSchema = new Schema({
    application: {
        type: ObjectId,
        ref: 'Application',
        required: CODE.KEYWORD.REQUIRED_APPLICATION
    },
    noun: {
        type: String,
        required: CODE.KEYWORD.REQUIRED_NOUN
    },
    nounType: {
        type: String,
        required: CODE.KEYWORD.REQUIRED_NOUN_TYPE
    },
    count: {
        type: Number,
        default: 1
    },
    registered: {
        type: Date,
        required: CODE.KEYWORD.REQUIRED_REGISTERED
    }
});

KeywordSchema.index({application: 1, history: 1});
KeywordSchema.index({noun: 1});

module.exports = mongoose.model('Keyword', KeywordSchema);
