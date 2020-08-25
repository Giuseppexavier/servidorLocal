'use strict';

const express = require('express');
const router = express.Router();

const controller = require('../controllers/matric-controller');
const authService = require('../services/auth-service');

router.get('/matriculas', authService.authorize, controller.consultMatric);
router.get('/notas/:matric_id/:etapa', authService.authorize, controller.consultNotas);
router.get('/financeiro/:matric_id', authService.authorize, controller.consultBoletos);


module.exports = router;