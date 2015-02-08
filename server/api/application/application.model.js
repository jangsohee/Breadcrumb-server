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
    ]
});

module.exports = mongoose.model('Application', ApplicationSchema);
