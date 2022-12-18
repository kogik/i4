var express = require("express");
var createHttpError = require("http-errors");
var passport = require("passport");
const { User } = require("../models/user");
var router = express.Router();

/* GET home page. */

router.get("/dashboard", (req, res, next) => {
	res.render("user/dashboard", { title: "i4 - dashboard", user: req.user });
});

router.get("/admin-panel", isAdmin, async (req, res, next) => {
	User.find({}, (err, result) => {
		if (err) console.log(err);
		res.render("user/admin-panel", { title: "i4 - adminpanel", user: req.user, users: result, message: req.flash("admin-message") });
	});
});

// logic
router.get("/profile", (req, res, next) => {
	res.render("user/profile", { title: "i4 - your profile", user: req.user, message: req.flash("profile-message") });
});

router.post("/admin-panel/create-user", isAdmin, (req, res, next) => {
	console.log(req.body);
	User.register({ username: req.body.username, role: req.body.role }, req.body.password, (err) => {
		if (err) req.flash("admin-message", "Unable to create user.");
		else req.flash("admin-message", "User " + req.body.username + " successfully created.");
		res.redirect("/user/admin-panel");
	});
});

router.post("/change-password", (req, res, next) => {
	var { current_password, new_password, re_new_password } = req.body;
	if (new_password != re_new_password) {
		req.flash("profile-message", "New passwords doesnt match.");
		res.redirect("/user/profile");
	}
	User.findById(req.user._id)
		.then((foundUser) => {
			foundUser
				.changePassword(current_password, new_password)
				.then(() => {
					req.flash("profile-message", "Password has been changed.");
					res.redirect("/user/profile");
				})
				.catch((error) => {
					req.flash("profile-message", "Current password is invalid.");
					res.redirect("/user/profile");
				});
		})
		.catch((error) => {
			req.flash("profile-message", "Current password is invalid.");
			res.redirect("/user/profile");
		});
});

router.get("/admin-panel/delete-user/:id", isAdmin, (req, res, next) => {
	User.findByIdAndDelete(req.params.id, (err) => {
		if (err) req.flash("admin-message", "Unable to delete user.");
		else req.flash("admin-message", "User deleted.");
		res.redirect("/user/admin-panel");
	});
});

router.post("/edit-profile", (req, res, next) => {
	var { site } = req.body;
	var avatar = null;
	if (req.files.avatar) {
		req.files.avatar.mv("./public/images/avatars/" + req.user._id + ".png");
		avatar = req.user._id + ".png";
	} else {
		avatar = req.user.avatar;
	}
	User.findByIdAndUpdate(req.user._id, { site: site, avatar: avatar }, (error) => {
		if (error) req.flash("profile-message", "Unable to edit profile informations.");
		else req.flash("profile-message", "User informations has been saved.");
		res.redirect("/user/profile");
	});
});

function isAdmin(req, res, next) {
	if (req.user.role == "admin") return next();
	return res.redirect("/user/dashboard");
}

module.exports = router;
