'use strict';

const nodeFirebird = require('node-firebird');

const config = require('../config');

const pool = nodeFirebird.pool(5, config.FIREBIRD_OPTIONS);

module.exports = pool;