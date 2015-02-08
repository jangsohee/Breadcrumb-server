'use strict';

module.exports = {
    select: '_id rootHistories',
    roots: {
        path: 'rootHistories',
        select: '_id title url keyword parent children registered',
        model: 'History'
    }
};