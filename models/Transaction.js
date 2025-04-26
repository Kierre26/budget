module.exports = (sequelize, DataTypes) => {
  // Define the transaction table
  const Transaction = sequelize.define('Transaction', {
    amount: { // Decimal, greater than or equal to 0.01
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: 0.01 }
    },
    // Date must not be in the future, not null
    transaction_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isNotFuture(value) {
          if (new Date(value) > new Date()) {
            throw new Error('Transaction date cannot be in the future');
          }
        }
      }
    },
    // Optional description
    description: { type: DataTypes.STRING, allowNull: true },
    // Must be Income or Expense, not null
    type: {
      type: DataTypes.ENUM('income', 'expense'),
      allowNull: false
    }
  });

  Transaction.associate = models => {
    // Each transaction belongs to one user
    Transaction.belongsTo(models.User, { foreignKey: 'userId' });
    // Each transaction belongs to one category
    Transaction.belongsTo(models.Category, { foreignKey: 'categoryId' });
  };

  return Transaction; // Export the model
};
