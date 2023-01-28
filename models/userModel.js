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
},{
    timestamps:true
});

// virtual for a specific user's url
userSchema.virtual('url').get(function(){
    return `/admin/customer/${this._id}`;
});

module.exports=mongoose.model('User',userSchema);