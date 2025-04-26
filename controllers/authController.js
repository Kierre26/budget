const bcrypt = require('bcrypt');
const { User } = require('../models');

module.exports = {
  showRegister(req, res) {  // Show and render registration form
    res.render('register');
  },

  // Registration form submission
  async register(req, res) {
    try {
      const { username, email, password } = req.body; // Extract form fields
      const hash = await bcrypt.hash(password, 10); // Hash password
      const user = await User.create({ username, email, password: hash }); // Create new user
      req.session.userId = user.id; // Store user id in session then redirect to dashboard
      res.redirect('/dashboard');
    } catch (err) {
      console.error(err); // Log the possible error
      res.render('register', { error: err.message });
    }
  },

  // Show the login form
  showLogin(req, res) {
    res.render('login');
  },

  // Handle login form
  async login(req, res) {
    try {
      const { email, password } = req.body; // Extract form fields
      const user = await User.findOne({ where: { email } }); // Lookup user by email
      // If no user or password match, redirect back to login form
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.render('login', { error: 'Invalid credentials' });
      }
      req.session.userId = user.id; // Store user id in session then redirect to dashboard
      res.redirect('/dashboard');
    } catch (err) {
      console.error(err); // Log any errors
      res.render('login', { error: 'Login failed' });
    }
  },

  // Handle logout
  logout(req, res) {
    req.session.destroy(() => { // End session then redirect back to login form
      res.redirect('/login');
    });
  }
};
