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
        public_id:{
            type:String
        },
        url:{
            type:String
        }
    }
},{
    timestamps:true
});

//virtual for product's url
productSchema.virtual('url').get(function(){
    return `/admin/product/${this._id}`;
});

module.exports = mongoose.model('Product',productSchema);