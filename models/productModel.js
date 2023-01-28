const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type:String
    },

    price:{
        type:Number
    },

    description:{
        type:String
    },

    image:{
        url:{
            type:String
        }
    }
},{
    timestamps:true
});

//virtual for a specific product's url
productSchema.virtual('url').get(function(){
    return `/admin/product/${this._id}`;
});

module.exports = mongoose.model('Product',productSchema);