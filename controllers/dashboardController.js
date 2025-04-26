// controllers/dashboardController.js
const { Transaction, Budget, Category } = require('../models');
const { Op } = require('sequelize');

module.exports = {
  async showDashboard(req, res) {
    try {
      // Fetch all transactions and budgets
      const [txRecs, budgetRecs] = await Promise.all([
        Transaction.findAll({
          where: { userId: req.session.userId },
          include: [{ model: Category }],
          order: [['transaction_date', 'DESC']]
        }),
        Budget.findAll({
          where: { userId: req.session.userId },
          order: [['start','DESC']]
        })
      ]);

      // Convert to plain objects
      const transactions = txRecs.map(r => r.get({ plain: true }));

      // Build budgets with remaining and percent used
      const budgets = [];
      for (let rec of budgetRecs) {
        const b = rec.get({ plain: true });

        // sum up all expenses inside this budgets range
        const spent = await Transaction.sum('amount', {
          where: {
            userId: req.session.userId,
            type: 'expense',
            transaction_date: { [Op.between]: [b.start, b.end] }
          }
        }) || 0;

        b.remaining = (b.limit - spent).toFixed(2);
        b.usedPerc  = Math.round((spent / b.limit) * 100);

        budgets.push(b);
      }

      // Calculate overall totals
      const totalIncome = await Transaction.sum('amount', {
        where: { userId: req.session.userId, type: 'income' }
      }) || 0;
      const totalExpense = await Transaction.sum('amount', {
        where: { userId: req.session.userId, type: 'expense' }
      }) || 0;

      // Render dashboard with all data
      res.render('dashboard', {
        transactions,
        budgets,
        totalIncome,
        totalExpense
      });
    } catch (err) { // Log possible dashboard error
      console.error('Dashboard load error:', err);
      res.sendStatus(500);
    }
  }
};
