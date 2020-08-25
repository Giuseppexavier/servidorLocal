'use strict';

const express = require('express');
const router = express.Router();

const controller = require('../controllers/resp-controller');

router.post('/createPassword', controller.createPassword);
router.post('/authenticate/', controller.authenticate);
router.post('/recoverPassword/', controller.recoverPassword);
router.post('/changepassword/', controller.changePassword);

module.exports = router;