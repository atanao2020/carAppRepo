const mongoose = require('mongoose')
const carSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    plateNo:{
        type:Number,
        required:true
    },
    colour:{
        type:String,
        required:true
    },
    model:{
        type:String,
        required:true
    }
})

const Cars = mongoose.model("Cars", carSchema)
module.exports = Cars