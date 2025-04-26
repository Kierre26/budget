const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController'); // import auth logic

// Show the registration form
router.get('/register', auth.showRegister);
// Handle registration form submission
router.post('/register', auth.register);

// Show Login form
router.get('/login', auth.showLogin);
// Handle login form submission
router.post('/login', auth.login);

// Log the user out
router.get('/logout', auth.logout);

// Redirect to login or dashboard
router.get('/', (req, res) => {
  if (req.session.userId) { // If user is logged in, direct to dashboard
    return res.redirect('/dashboard');
  }
  res.redirect('/login'); // Else redirect back to login form
});

// End user session and redirect back to login form
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).send('Logout failed');
    res.clearCookie('connect.sid');       // clear session cookies
    res.redirect('/login');
  });
});


module.exports = router; // Export router
