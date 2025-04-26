const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();
const path = require('path');

// Initialize Sequelize with DATABASE_URL from .env
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false
});

// Load each model, passing in the same Sequelize instance and types
const User = require('./User')(sequelize, DataTypes);
const Budget = require('./Budget')(sequelize, DataTypes);
const Category = require('./Category')(sequelize, DataTypes);
const Transaction = require('./Transaction')(sequelize, DataTypes);

// Store models in one object
const db = {
  sequelize, // Sequelzie instance
  Sequelize, // Library for helpers
  User,
  Budget,
  Category,
  Transaction
};

// Run associations to set up foreign keys
Object.values(db).forEach(model => {
  if (model.associate) model.associate(db);
});

module.exports = db; // Export the full db object
