module.exports = (sequelize, DataTypes) => {
  // Define category table
  const Category = sequelize.define('Category', {
    // Category name must be unique and not null
    name: { type: DataTypes.STRING, allowNull: false, unique: true }
  });

  Category.associate = models => {
    // One category can have many transactions
    Category.hasMany(models.Transaction, { foreignKey: 'categoryId' });
  };

  return Category; // Export the model
};
