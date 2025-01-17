const express = require('express');
const router = express.Router();
const indexController = require('../controllers/index.controller');
const userController = require('../controllers/user.controller');

router.get("/",indexController.index);

module.exports = router;