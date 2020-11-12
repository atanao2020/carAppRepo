const mongoose = require('mongoose')
const passportLocalMongoose = require("passport-local-mongoose")
const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    fullName:{
        type:String,
        required:true
    },
    counter:{
        type:Number,
        requied:true
    }
})

UserSchema.plugin(passportLocalMongoose)
module.exports = mongoose.model("Users", UserSchema)