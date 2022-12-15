var mongoose = require('mongoose')
var {User} = require('../models/user')

mongoose.set('strictQuery', true)
mongoose.connect("mongodb://localhost:27017/i4test", {useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log("[DB] > connected"))
.catch(err => console.log(err))

User.register({"username": "fero", "role": "admin"}, "123", (err)=>{
    if (err) console.log(err)
    else console.log("user created")
})