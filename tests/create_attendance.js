var mongoose = require("mongoose");
var { Attendance } = require("../models/attendance");
require("dotenv").config();

// var mongo_url = "mongodb://localhost:27017/i4test";
var mongo_url = "mongodb+srv://i4test:" + process.env.MONGODB_PASS + "@cluster0.i8av4uz.mongodb.net/";
mongoose.set("strictQuery", true);
mongoose
    .connect(mongo_url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("[DB] > connected"))
    .catch((err) => console.log(err));

// Attendance.create({ user_id: mongoose.Types.ObjectId("63baa59e9fa70509a1fed591"), date: new Date("2023-01-08"), checkin: new Date() }).catch((error) => console.log(error).then((data) => console.log(data)));

Attendance.findById("63babae0f298cb8d3949a2c2").then((data) => {
    console.log(new Date(data.date).toLocaleDateString());
});
