'use strict';

module.exports = {
    select: '_id title url keyword parent children registered',
    children: {
        path: 'children',
        select: '_id title url keyword parent children registered',
        model: 'History'
    }
};