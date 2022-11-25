const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name:{
        type:String
    },

    email:{
        type:String,
        unique:true,
        validate:[validator.isEmail, 'Invalid email address']
    },

    password:{
        type:String
    }
});

module.exports=mongoose.model('User',userSchema);