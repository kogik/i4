var express = require('express');
var createHttpError = require('http-errors');
var passport = require('passport');
const { User } = require('../models/user');
var router = express.Router()

/* GET home page. */

router.get('/dashboard', function(req, res, next) {
    res.render('user/dashboard', { title: 'i4 - dashboard', user: req.user });
});

router.get('/admin-panel', isAdmin,async function(req, res, next) {
    User.find({},(err, result) =>{
        if (err) console.log(err)
        res.render('user/admin-panel', { title: 'i4 - dashboard', user: req.user, users: result });
    })
});

function isAdmin(req, res, next){
    if(req.user.role == "admin") return next()
    return res.redirect("/user/dashboard")
}



module.exports = router;
