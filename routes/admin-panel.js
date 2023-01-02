var express = require("express");
var createHttpError = require("http-errors");
var passport = require("passport");
var { User } = require("../models/user");
var mongoose = require("mongoose");
var router = express.Router();

// RENDER
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

// API ?
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
		var filename = req.user.newId + "." + mimetype[mimetype.length - 1];
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
	User.findByIdAndDelete(req.params.id)
		.catch((error) => {
			console.log(error);
			req.flash("admin-message", "Unable to delete user.");
			res.redirect("/admin-panel/employees");
		})
		.then(() => {
			req.flash("admin-message", "User deleted.");
			res.redirect("/admin-panel/employees");
		});
});

module.exports = router;
