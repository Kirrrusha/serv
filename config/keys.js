const prod = require('./keys_prod');
const dev = require('./keys_dev');

const key = process.env.NODE_ENV === 'production' ? prod : dev;

module.exports = ({...key})
