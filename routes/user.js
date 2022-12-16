var express = require('express');
var createHttpError = require('http-errors');
var passport = require('passport');
const { User } = require('../models/user');
var router = express.Router()

/* GET home page. */

router.get('/dashboard', function(req, res, next) {
    res.render('user/dashboard', { title: 'i4 - dashboard', user: req.user });
});

router.get('/admin-panel', isAdmin, async function(req, res, next) {
    User.find({},(err, result) =>{
        if (err) console.log(err)
        res.render('user/admin-panel', { title: 'i4 - dashboard', user: req.user, users: result, message: req.flash('admin-message') });
    })
});

router.post('/admin-panel/create-user', isAdmin, (req, res, next) => {
    console.log(req.body)
    User.register({"username": req.body.username, "role": req.body.role}, req.body.password, (err)=>{
        if (err) req.flash('admin-message', 'Unable to create user.')
        else req.flash('admin-message', "User " + req.body.username + " successfully created.")
        res.redirect('/user/admin-panel')
    })
})

router.get('/admin-panel/delete-user/:id', isAdmin, (req, res, next) => {
    User.findByIdAndDelete(req.params.id, (err)=>{
        if (err) req.flash('admin-message', 'Unable to delete user.')
        else req.flash('admin-message', "User deleted.")
        res.redirect('/user/admin-panel')

    })
})



function isAdmin(req, res, next){
    if(req.user.role == "admin") return next()
    return res.redirect("/user/dashboard")
}



module.exports = router;
