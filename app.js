var createError = require("http-errors");
var express = require("express");
var path = require("path");
var session = require("express-session");
var logger = require("morgan");
var mongoose = require("mongoose");
var { User, UserSchema } = require("./models/user");
var passport = require("passport");
var flash = require("connect-flash");
var fileUpload = require("express-fileupload");

var indexRouter = require("./routes/index");
var userRouter = require("./routes/user");

const { env } = require("process");

var app = express();

require("dotenv").config();

mongoose.set("strictQuery", true);

var mongoose_url;
if (env.NODE_ENV.indexOf("dev") > -1) mongoose_url = "mongodb://localhost:27017/i4test";
else mongoose_url = "mongodb+srv://i4test:" + process.env.MONGODB_PASS + "@cluster0.i8av4uz.mongodb.net/";

mongoose
	.connect(mongoose_url, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log("[DB] > connected"))
	.catch((err) => console.log(err));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// morgan middleware
app.use(logger("dev"));

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
	session({
		secret: env.SESSION_SECRET,
		resave: false,
		saveUninitialized: true,
	})
);
app.use(flash());

// express-fileupload
app.use(fileUpload());

// Passport.js
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) return next();
	res.redirect("/login");
}

function isLoggedOut(req, res, next) {
	if (!req.isAuthenticated()) return next();
	res.redirect("/");
}

app.use("/", indexRouter);
app.use("/user", isLoggedIn, userRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	res.status(err.status || 500);
	res.render("error");
});

module.exports = app;
