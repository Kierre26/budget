// controllers/transactionsController.js
const { Transaction, Category } = require('../models');

module.exports = {
  // List all transactions
  async index(req, res) {
    try {
      const records = await Transaction.findAll({
        where: { userId: req.session.userId }, // Current user
        include: [{ model: Category }],
        order: [['transaction_date', 'DESC']],
      });
      // Convert transactions to plain object and render transactions page
      const transactions = records.map(r => r.get({ plain: true }));
      res.render('transactions/index', { transactions });
    } catch (err) { // Log possible transaction errors
      console.error('Error loading transactions:', err);
      res.sendStatus(500);
    }
  },

  // Create a new transaction form
  async new(req, res) {
    try {
      // Render form with categories list
      const cats = await Category.findAll({ order: [['name', 'ASC']] });
      const categories = cats.map(c => c.get({ plain: true }));
      res.render('transactions/new', { categories });
    } catch (err) { // Log transaction errors
      console.error('Error loading new transaction form:', err);
      res.sendStatus(500);
    }
  },

  // Save new transaction
  async create(req, res) {
    try { // Extract form fields
      const { transaction_date, categoryId, type, amount, description } = req.body;
      await Transaction.create({
        transaction_date,
        categoryId,
        type,
        amount,
        description,
        userId: req.session.userId // Associate to current user
      });
      res.redirect('/dashboard');
    } catch (err) { // Log transaction errors
      console.error('Error creating transaction:', err);
      res.sendStatus(400);
    }
  },

  // Show transaction edit form
  async edit(req, res) {
    try {
      const record = await Transaction.findOne({
        where: { id: req.params.id, userId: req.session.userId }
      }); // If no record is found, redirect 
      if (!record) return res.redirect('/transactions');

      const transaction = record.get({ plain: true }); // Convert categories to plain object
      const cats = await Category.findAll({ order: [['name', 'ASC']] });
      const categories = cats.map(c => c.get({ plain: true }));

      res.render('transactions/edit', { transaction, categories });
    } catch (err) { // Log errors with transaction edit form
      console.error('Error loading edit form:', err);
      res.sendStatus(500);
    }
  },

  // Update transactions 
  async update(req, res) {
    try { // Extract form fields and update to user
      const { transaction_date, categoryId, type, amount, description } = req.body;
      await Transaction.update(
        { transaction_date, categoryId, type, amount, description },
        { where: { id: req.params.id, userId: req.session.userId } }
      );
      res.redirect('/dashboard');
    } catch (err) { // Log transaction update errors
      console.error('Error updating transaction:', err);
      res.sendStatus(400);
    }
  },

  // Remove a transaction and redirect back to dashboard
  async destroy(req, res) {
    try {
      await Transaction.destroy({
        where: { id: req.params.id, userId: req.session.userId } // Specific user
      });
      res.redirect('/dashboard');
    } catch (err) { // Log transaction deleting errors 
      console.error('Error deleting transaction:', err);
      res.sendStatus(500);
    }
  }
};
