const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        lowercase: true,
    },
    password: {
        type: String,
        require: true,
    },
    role: {
        type: String,
        require: true,
    },
    avatar: {
        type: String,
        default: "default.png",
    },
    site: {
        type: String,
        uppercase: true,
    },
});

UserSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", UserSchema);

module.exports = {
    User,
    UserSchema,
};
