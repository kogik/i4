var express = require("express");
const { User } = require("../models/user");
var router = express.Router();

/* GET home page. */

router.get("/dashboard", (req, res, next) => {
	res.render("user/dashboard", { title: "i4 - dashboard", user: req.user });
});

// logic
router.get("/profile", (req, res, next) => {
	res.render("user/profile", { title: "i4 - your profile", user: req.user, message: req.flash("profile-message") });
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

router.post("/edit-profile", (req, res, next) => {
	var { site } = req.body;
	var avatar = req.user.avatar;
	if (req.files) {
		var { mimetype } = req.files.avatar;
		// filters (requirements)
		if (req.files.avatar.size > 8 * 1024 * 1024) {
			req.flash("profile-message", "File is too large. (Maximum file size is 8mb)");
			return res.redirect("/user/profile");
		}
		if (!(mimetype == "image/png" || mimetype == "image/jpeg")) {
			req.flash("profile-message", "Invalid image filetype. (Allowed only .jpg, .jpeg, .png)");
			return res.redirect("/user/profile");
		}
		mimetype = mimetype.split("/");
		var filename = req.user._id + "." + mimetype[mimetype.length - 1];
		req.files.avatar.mv("./public/images/avatars/" + filename);
		avatar = filename;
	}
	User.findByIdAndUpdate(req.user._id, { site: site, avatar: avatar }, (error) => {
		if (error) req.flash("profile-message", "Unable to edit profile informations.");
		else req.flash("profile-message", "User informations has been saved.");
		res.redirect("/user/profile");
	});
});

module.exports = router;
