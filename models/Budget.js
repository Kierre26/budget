module.exports = (sequelize, DataTypes) => {
  // Define budget table
  const Budget = sequelize.define('Budget', {
    // Budget title
    title: { type: DataTypes.STRING, allowNull: false },
    // Max spending limit, decimal with 2 places, >= 0.01
    limit: { type: DataTypes.DECIMAL(10, 2), allowNull: false, validate: { min: 0.01 } },
    // Start of the budget range
    start: { type: DataTypes.DATEONLY, allowNull: false },
    // End of the budget range
    end: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: { // End date must be after start date
        isAfterStart(value) {
          if (this.start && value <= this.start) {
            throw new Error('End date must be after start date');
          }
        }
      }
    }
  });
  // Set up associations after models are loaded
  Budget.associate = models => {
    Budget.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return Budget; // Export the model
};
