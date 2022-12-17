var mongoose = require("mongoose");
var { User } = require("../models/user");

var mongo_url = "mongodb://localhost:27017/i4test";
// var mongo_url = "mongodb+srv://i4test:" + process.env.MONGODB_PASS + "@cluster0.i8av4uz.mongodb.net/"
mongoose.set("strictQuery", true);
mongoose
	.connect(mongo_url, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log("[DB] > connected"))
	.catch((err) => console.log(err));

User.register({ username: "fero", role: "admin" }, "123", (err) => {
	if (err) console.log(err);
	else console.log("user created");
});
