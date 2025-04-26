require('dotenv').config(); // Load and envirment variables from .env
const express = require('express');
const exphbs  = require('express-handlebars');
const session = require('express-session'); // Import session middleware
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const { sequelize } = require('./models'); // Import sequelize instance
const methodOverride = require('method-override'); // Import middleware to support Update/Delete
const path = require('path');

// 1) Handlebars setup
const hbs = exphbs.create({
  extname: 'hbs',
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  defaultLayout: 'main',
  partialsDir: [ path.join(__dirname, 'views', 'partials') ],
  helpers: {
    // Mark an option as selected
    selected: (val, current) => {
      if (val == null || current == null) return '';
      return val.toString() === current.toString() ? 'selected' : '';
    },
    // Output raw JSON
    json: obj => JSON.stringify(obj),

    // Format M/D/YYYY
    dateFormat: dateStr => {
      if (!dateStr) return '';
      const d = new Date(dateStr);
      const month = d.getUTCMonth() + 1;      
      const day   = d.getUTCDate();          
      const year  = d.getUTCFullYear();       
      return `${month}/${day}/${year}`;
    },
    // Equality check
    eq: (a, b) => a === b, 
    // Greater than check
    gt: (a, b) => a > b
  }
});

const app = express(); // Create express app
// Static files in public
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Session setup, store in the database
app.use(session({
  secret: process.env.SESSION_SECRET, // Sign session ID
  store: new SequelizeStore({ db: sequelize }), // Store session data in Postgres
  resave: false, // Dont save unchanged sessions
  saveUninitialized: false, // Dont create session until something is stored
  cookie: { secure: false }
}));
// Make userId available in every template
app.use((req, res, next) => {
  res.locals.userId = req.session.userId;
  next();
});

// Allow form methods like update and delete
app.use(methodOverride('_method'));

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
// Setup views path
app.set('views', path.join(__dirname, 'views'));

// public auth routes
const authRouter = require('./routes/auth');
app.use('/', authRouter);

// protected dashboard
const dashboardRouter = require('./routes/dashboard');
app.use('/dashboard', dashboardRouter);

// Protected transactions
const transactionsRouter = require('./routes/transactions');
app.use('/transactions', transactionsRouter);

// Protected budgets
const budgetsRouter = require('./routes/budgets');
app.use('/budgets', budgetsRouter);

// Start the server after syncing models
sequelize.sync().then(() => {
  app.listen(3000, () =>
    console.log('Server listening on http://localhost:3000')
  );
});
