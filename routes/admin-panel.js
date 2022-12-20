var express = require("express");
var createHttpError = require("http-errors");
var passport = require("passport");
const { User } = require("../models/user");
var router = express.Router();

// RENDER
//
//
//
//

router.get("/", async (req, res, next) => {
	res.redirect("/admin-panel/attendance");
});
router.get("/test", async (req, res, next) => {
	User.find({}, (err, result) => {
		if (err) console.log(err);
		res.render("admin-panel/old_index", { title: "i4 - adminpanel", user: req.user, users: result, message: req.flash("admin-message") });
	});
});

router.get("/attendance", async (req, res, next) => {
	res.render("admin-panel/attendance", { title: "i4 - adminpanel", user: req.user, message: req.flash("admin-message") });
});

// API ?
//
//
//
//
router.post("/create-user", (req, res, next) => {
	User.register({ username: req.body.username, role: req.body.role }, req.body.password, (err) => {
		if (err) req.flash("admin-message", "Unable to create user.");
		else req.flash("admin-message", "User " + req.body.username + " successfully created.");
		res.redirect("/user/admin-panel");
	});
});

router.post("/attendance", (req, res, next) => {
	var { name, date } = req.body;
	var filter = {};
	console.log(name, date);

	if (name || date) {
		//magic
		var site = name.toLocaleUpperCase();
		filter = { $and: [{ $or: [{ username: { $regex: name } }, { attendance: { $elemMatch: { site: { $regex: site } } } }] }, { attendance: { $elemMatch: { date: { $regex: date } } } }] };
	}

	User.find(filter)
		.then((users) => {
			var attendance = [];
			for (user in users) {
				user = users[user];
				if (user.attendance.length > 0) {
					attendance.push({
						username: user.username,
						status: user.role,
						login: user.attendance[0].login,
						logout: user.attendance[0].logout,
						site: user.attendance[0].site,
						date: user.attendance[0].date,
					});
				}
			}
			res.send(attendance);
		})
		.catch((error) => {
			console.log(error);
		});
});

router.get("/delete-user/:id", (req, res, next) => {
	User.findByIdAndDelete(req.params.id, (err) => {
		if (err) req.flash("admin-message", "Unable to delete user.");
		else req.flash("admin-message", "User deleted.");
		res.redirect("/user/admin-panel");
	});
});

module.exports = router;
