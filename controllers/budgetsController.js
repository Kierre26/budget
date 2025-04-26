const { Budget, Transaction } = require('../models');
const { Op } = require('sequelize');

module.exports = {
  // List all budgets for this user
  async index(req, res) {
    try {
      // Fetch all budgets for this user
      const raw = await Budget.findAll({
        where: { userId: req.session.userId }, // Search by user and show newest first
        order: [['start', 'DESC']]
      });

      // Convert to plain objects & compute remaining for each
      const budgets = [];
      for (let rec of raw) {
        const b = rec.get({ plain: true });

        // Sum all expenses in this budget’s date range
        const spent = await Transaction.sum('amount', {
          where: {
            userId: req.session.userId,
            type: 'expense',
            transaction_date: { [Op.between]: [b.start, b.end] }
          }
        });
        // Calculte remaining value and collect result
        b.remaining = (b.limit - (spent || 0)).toFixed(2);
        budgets.push(b);
      }

      // Render budget list view
      res.render('budgets/index', { budgets });
    } catch (err) { // Log possible errors
      console.error('Error loading budgets:', err);
      res.sendStatus(500);
    }
  },

  // New budget form
  new(req, res) {
    res.render('budgets/new');
  },

  // Save a new budget
  async create(req, res) {
    try {
      // Extract form fields
      const { title, limit, start, end } = req.body;

      await Budget.create({
        title,
        limit,
        start,
        end,
        userId: req.session.userId // Asscoiate with current user
      });

      res.redirect('/dashboard'); // Redirect back to dashboard
    } catch (err) { // Log possible errors
      console.error('Error creating budget:', err);

      // If validation failed, re‑render with an error message
      if (err.name === 'SequelizeValidationError') {
        return res.render('budgets/new', {
          error: err.errors.map(e => e.message).join(', ')
        });
      }

      res.sendStatus(400);
    }
  },

  // Form to edit an existing budget
  async edit(req, res) {
    try {
      const rec = await Budget.findOne({
        where: { id: req.params.id, userId: req.session.userId }
      });
      if (!rec) return res.redirect('/budgets'); // If budget is not found redirect
      const budget = rec.get({ plain: true }); // Convert to plain object
      res.render('budgets/edit', { budget }); // Render edit form with fields filled
    } catch (err) { // Log possible errors
      console.error('Error loading edit form:', err);
      res.sendStatus(500);
    }
  },

  // Update a budget
  async update(req, res) {
    try {
      const { title, limit, start, end } = req.body;

      await Budget.update( // Update budget data
        { title, limit, start, end },
        { where: { id: req.params.id, userId: req.session.userId } }
      );

      res.redirect('/dashboard'); // Redirect back to dashboard
    } catch (err) { // Log possible errors
      console.error('Error updating budget:', err);

      if (err.name === 'SequelizeValidationError') {
        // Re‑render the edit form with error and current values
        return res.render('budgets/edit', {
          budget: { id: req.params.id, ...req.body },
          error: err.errors.map(e => e.message).join(', ')
        });
      }

      res.sendStatus(400);
    }
  },

  // Remove a budget
  async destroy(req, res) {
    try {
      await Budget.destroy({
        where: { id: req.params.id, userId: req.session.userId }
      });
      res.redirect('/dashboard');
    } catch (err) {
      console.error('Error deleting budget:', err);
      res.sendStatus(500);
    }
  }
};
