'use strict';

module.exports = {
    select: '_id title url keyword parent children registered',
    keyword: {
        path: 'keyword',
        select: '_id noun count',
        model: 'Keyword'
    },
    children: {
        path: 'children',
        select: '_id title url keyword parent children registered',
        model: 'History'
    }
};