const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const AttendanceSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
    },
    user_id: {
        type: mongoose.Types.ObjectId,
        require: true,
    },
    site: {
        type: String,
    },
    date: {
        type: Date,
    },
    checkin: {
        type: Number,
    },
    checkout: {
        type: Number,
    },
});

const Attendance = mongoose.model("Attendance", AttendanceSchema);

module.exports = {
    Attendance,
    AttendanceSchema,
};
