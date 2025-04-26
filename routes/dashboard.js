const express = require('express');
const router = express.Router();
const requireAuth = require('./requireAuth'); // import authorization middleware
const dashboardCtrl = require('../controllers/dashboardController'); // import dashboard logic

// Protected dashboard view
router.get('/', requireAuth, dashboardCtrl.showDashboard);

module.exports = router; // export the dashboard router
