const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');


const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    }
})

UserSchema.plugin(passportLocalMongoose)
const User = mongoose.model("User", UserSchema)





module.exports = { User, UserSchema }