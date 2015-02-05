'use strict';

module.exports = {
    keyword: {
        path: 'keyword',
        select: '_id noun count',
        model: 'Keyword'
    },
    parent: {
        path: 'parent',
        model: 'History'
    },
    children: {
        path: 'children',
        model: 'History'
    }
};