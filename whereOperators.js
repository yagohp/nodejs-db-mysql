'use strict'

/**
 * Enumerador de ações básicas de serviços
 */
const WhereOperators = () => {
    return {
        NOT: 'NOT', OR: 'OR', AND: 'AND',
        BETWEEN: 'BETWEEN', LIKE: 'LIKE', 
        DIFF: '<>', IN: 'IN', NIN: 'NOT IN', EQUALS: '=',
        LTE: '<=', LT: '<', GT: '>', GTE: '>='
    }
};

module.exports = WhereOperators()
