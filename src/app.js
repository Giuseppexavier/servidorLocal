'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');

const util = require('./util/util');

const app = express();

app.use(compression());

global.methodsList = {};

//fake Powered-By
app.use((req, res, next) => {
  res.set('X-Powered-By', 'PHP/7.1.7');
  next();
});

//fs.ensureDirSync('./logs');

//Carregar rotas
const indexRoute = require('./routes/index-route');
const respRoute = require('./routes/resp-route');
const matricRoute = require('./routes/matric-route');


//Carregar middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


//Disponibilizar rotas
app.use('/', indexRoute);
app.use('/resp', respRoute);
app.use('/matric', matricRoute);
module.exports = app;

console.log('Iniciando servidor: ' + new Date().toLocaleString());
//console.log(util.validaCpf('05336699365'));
