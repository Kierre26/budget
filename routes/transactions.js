const express = require('express');
const router = express.Router();
const requireAuth = require('./requireAuth'); // import authorization middleware
const ctrl = require('../controllers/transactionsController'); // import transaction logic

router.use(requireAuth); // Protect all transaction routes

router.get('/',    ctrl.index);        // List all transactions
router.get('/new', ctrl.new);          // Show transaction create form
router.post('/',   ctrl.create);       // Save new transaction
router.get('/:id/edit', ctrl.edit);    // Show transaction edit form
router.put('/:id',      ctrl.update);  // Update transaction
router.delete('/:id',   ctrl.destroy); // Delete transaction

module.exports = router; // Export transaction router
