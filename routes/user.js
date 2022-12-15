var express = require('express');
var createHttpError = require('http-errors');
var passport = require('passport')
var router = express.Router()

/* GET home page. */

router.get('/dashboard', function(req, res, next) {
    res.render('user/dashboard', { title: 'i4 - dashboard', user: req.user });
});

router.get('/admin-panel', isAdmin, function(req, res, next) {
    res.render('user/admin-panel', { title: 'i4 - dashboard', user: req.user });
});

function isAdmin(req, res, next){
    if(req.user.role == "admin") next()
    res.redirect("/user/dashboard")
}



module.exports = router;
