'use strict';

var mongoose = require('../../components/mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId,
    CODE = require('../../components/protocol/CODE');

var ApplicationSchema = new Schema({
    rootHistories: [
        {
            type: ObjectId,
            ref: 'History'
        }
    ],
    registered: {
        type: Date,
        required: CODE.APPLICATION.REQUIRED_REGISTERED
    },
    deleted: Date
});


module.exports = mongoose.model('Application', ApplicationSchema);
