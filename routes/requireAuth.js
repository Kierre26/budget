module.exports = function requireAuth(req, res, next) {
    if (!req.session.userId) {
      // If not logged in redirect to login
      return res.redirect('/login');
    }
    // If logged in continue
    next();
  };
  