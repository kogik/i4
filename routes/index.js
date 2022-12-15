var express = require('express');
const createHttpError = require('http-errors');
var passport = require('passport')
var router = express.Router()

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'i4' });
});

router.get('/login', isLoggedOut, async function(req, res, next) {
  var msg = await req.flash("error")
  res.render('login', { title: 'i4 - login', messages: msg });
});



router.post("/login", isLoggedOut, passport.authenticate('local', {
  successRedirect: "/user/dashboard",
  failureRedirect: "/login",
  failureFlash: true
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
