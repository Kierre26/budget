module.exports = (sequelize, DataTypes) => {
  // Define the user table  
  const User = sequelize.define('User', {
    // Unique username, not null
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    // Unique and in email format
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    // At least 6 characters, not null 
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { len: [6, 100] }
    }
  });

  User.associate = models => {
    // One user has many transactions
    User.hasMany(models.Transaction, { foreignKey: 'userId' });
    // One user has many budgets
    User.hasMany(models.Budget, { foreignKey: 'userId' });
  };

  return User; // Export the model
};
