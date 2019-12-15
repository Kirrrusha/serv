module.exports = {
    'env': {
        'browser': true,
        'commonjs': true,
        'es6': true
    },
    'extends': 'eslint:recommended',
    'globals': {
        'Atomics': 'readonly',
        'SharedArrayBuffer': 'readonly'
    },
    'parserOptions': {
        'ecmaVersion': 2018
    },
    'ecmaFeatures': { 'destructuring': true },
    'rules': {
        'no-unused-vars': [2, {'vars': 'all', 'varsIgnorePattern': '[iI]gnored'}]
    }
};