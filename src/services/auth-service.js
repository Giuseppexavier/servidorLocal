'use strict';

const jwt = require('jsonwebtoken');
const config = require('../config');

exports.generateToken = async (data) => {
  return jwt.sign(data, config.SALT_KEY, { expiresIn: '1d' });
}

exports.decodeToken = async (token) => {
  var data = await jwt.verify(token, config.SALT_KEY);
  return data;
}

exports.authorize = function (req, res, next) {
  var token = req.headers['x-access-token'];

  if (!token) {
    res.status(401).json({
      message: 'Restrict Access'
    });
  } else {
    jwt.verify(token, config.SALT_KEY, function (error, decoded) {
      if (error) {
        res.status(401).json({
          message: 'Invalid Request'
        });
      } else {
        next();
      }
    });
  }
};
