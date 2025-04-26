
// Resets the database and seeds initial data 
const { sequelize, Category } = require('./models');

(async () => {
  try {
    console.log('Resetting database...');
    await sequelize.sync({ force: true });   // Drops & recreates all tables

    console.log('Seeding categories...');
    await Category.bulkCreate([
      { name: 'Groceries' },
      { name: 'Rent' },
      { name: 'Utilities' },
      { name: 'Salary' },
      { name: 'Entertainment' },
      { name: 'Transport' },
      { name: 'Health' }
    ]);

    console.log('Database reset and seeded successfully!');
  } catch (err) {
    console.error('Error during reset:', err);
  } finally {
    process.exit();
  }
})();
