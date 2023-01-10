var express = require("express");
var createHttpError = require("http-errors");
var passport = require("passport");
var { User } = require("../models/user");
var { Attendance } = require("../models/attendance");
var mongoose = require("mongoose");
var router = express.Router();
var fs = require("fs");
const { route } = require("./user");

// GET
//
//
//
//

router.get("/", async (req, res, next) => {
    res.redirect("/admin-panel/employees");
});
router.get("/employees", async (req, res, next) => {
    User.find({}, (err, result) => {
        if (err) console.log(err);
        res.render("admin-panel/employees", { title: "i4 - adminpanel", user: req.user, users: result, message: req.flash("admin-message") });
    });
});

router.get("/attendance", async (req, res, next) => {
    res.render("admin-panel/attendance", { title: "i4 - adminpanel", user: req.user, message: req.flash("admin-message") });
});

router.get("/user/profile/:id", (req, res, next) => {
    User.findById(req.params.id)
        .catch((error) => {
            req.flash("admin-message", "User with id=" + req.params.id + "does not exist.");
            res.redirect("/admin-panel/employees");
        })
        .then((user) => {
            res.render("admin-panel/profile", { title: "i4 - user profile", user: req.user, profile: user });
        });
});

// POST
//
//
//
//
router.post("/create-user", (req, res, next) => {
    var avatar;
    var newId = mongoose.Types.ObjectId();
    if (req.files) {
        var { mimetype } = req.files.avatar;
        // filters (requirements)
        if (req.files.avatar.size > 8 * 1024 * 1024) {
            req.flash("admin-message", "File is too large. (Maximum file size is 8mb)");
            return res.redirect("/admin-panel/employees");
        }
        if (!(mimetype == "image/png" || mimetype == "image/jpeg")) {
            req.flash("admin-message", "Invalid image filetype. (Allowed only .jpg, .jpeg, .png)");
            return res.redirect("/admin-panel/employees");
        }
        mimetype = mimetype.split("/");
        var filename = newId + "." + mimetype[mimetype.length - 1];
        req.files.avatar.mv("./public/images/avatars/" + filename);
        avatar = filename;
    }
    User.register({ _id: newId, username: req.body.username, role: req.body.role, avatar: avatar }, req.body.password, (err) => {
        if (err) req.flash("admin-message", "User already exists.");
        else req.flash("admin-message", "User " + req.body.username + " successfully created.");
        res.redirect("/admin-panel/employees");
    });
});

router.post("/attendance", (req, res, next) => {
    var { name, date } = req.body;
    if (name || date) {
        // filter properly
        //
        // filter = { $and: [{ $or: [{ username: { $regex: name } }, { attendance: { $elemMatch: { site: { $regex: site } } } }] }, { attendance: { $elemMatch: { date: { $regex: date } } } }] };
        Attendance.find({ $and: [{ $or: [{ username: { $regex: name } }, { site: { $regex: name } }] }, date ? { date: new Date(date) } : {}] })
            .catch((error) => {
                console.log(error);
                res.status(500).json({ error });
            })
            .then((data) => {
                res.json(data);
            });
    } else {
        // get latest 10 documents from attendance
        Attendance.find()
            .sort({ date: -1 })
            .limit(10)
            .catch((error) => {
                res.status(500).json(error);
            })
            .then((docs) => {
                console.log(docs);
                res.json(docs);
            });
    }
});

router.post("/users-stats", (req, res, next) => {
    User.find()
        .catch((error) => {
            console.log(error);
            res.json({
                status: "error",
                error,
            });
        })
        .then((users) => {
            data = {
                status: "success",
                count: 0,
                admins: 0,
                employees: 0,
                self_employed: 0,
                others: 0,
            };
            for (user of users) {
                data.count++;
                if (user.role == "admin") {
                    data.admins++;
                }
                if (user.role == "employee") {
                    data.employees++;
                }
                if (user.role == "self-employed") {
                    data.self_employed++;
                } else {
                    data.others++;
                }
            }
            res.json(data);
        });
});

router.post("/user/profile/edit/:id", (req, res, next) => {
    var user_id = req.params.id;
    var { username, role, email, mobile, site, car, address } = req.body;
    User.findByIdAndUpdate(user_id, { username, role, site, email, mobile, car, address })
        .catch((error) => {
            res.status(500).json(error);
        })
        .then((data) => {
            res.json(data);
        });
});

router.get("/delete-user/:id", (req, res, next) => {
    User.findByIdAndDelete(req.params.id)
        .catch((error) => {
            console.log(error);
            req.flash("admin-message", "Unable to delete user.");
            res.redirect("/admin-panel/employees");
        })
        .then((user) => {
            console.log(user.avatar);
            fs.unlink("./public/images/avatars/" + user.avatar, (error) => {
                if (error) console.log(error);
            });
            req.flash("admin-message", "User deleted.");
            res.redirect("/admin-panel/employees");
        });
});

module.exports = router;
