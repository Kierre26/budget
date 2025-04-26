const express = require('express');
const router = express.Router();
const requireAuth = require('./requireAuth'); // import authorization middleware
const ctrl = require('../controllers/budgetsController'); // import budget logic

router.use(requireAuth); // Protect all budget routes

router.get('/', ctrl.index);         // List all budgets
router.get('/new', ctrl.new);        // Show create budget form
router.post('/', ctrl.create);       // Save new budget
router.get('/:id/edit', ctrl.edit);  // Show edit budget form
router.put('/:id', ctrl.update);     // Update budget
router.delete('/:id', ctrl.destroy); // Delete budget

module.exports = router; // Export budget router
