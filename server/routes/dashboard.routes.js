const express = require('express');
const router = express.Router();
const { dashboard } = require('../controllers/dashboard.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.get('/', authenticate, dashboard);

module.exports = router;
