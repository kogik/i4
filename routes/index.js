var express = require('express');
const createHttpError = require('http-errors');
var passport = require('passport')
var router = express.Router()

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'i4' });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'i4 - login' });
});

router.get('/dashboard',isLoggedIn, function(req, res, next) {
  res.render('dashboard', { title: 'i4 - dashboard', user: req.user.username });
});

router.post("/login", passport.authenticate('local', {
  successRedirect: "/dashboard",
  failureRedirect: "/login",
}))


router.get('/logout', function(req, res, next) {
  req.logout((err)=>{
    if (err) console.log(err)
  })
  res.redirect('/')
});






function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) return next();
	res.redirect('/login');
}

function isLoggedOut(req, res, next) {
	if (!req.isAuthenticated()) return next();
	res.redirect('/');
}



module.exports = router;
