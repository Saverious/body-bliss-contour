const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
    },

    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Product"
        },

        name:{
            type:String
        },

        description:{
            type:String
        },

        imgUrl:{
            type:String
        },

        quantity: {
            type: Number,
            required: true,
            min: [1, 'Quantity cannot be less then 1.'],
            default: 1
        },

        price:{
            type: Number
        }
    }],

    bill: {
        type: Number,
        required: true
    }
},{
    timestamps:true
});

// virtual for a specific cart's url
cartSchema.virtual('url').get(function(){
    return `/admin/cart/${this._id}`;
});

module.exports = mongoose.model('Cart',cartSchema);
