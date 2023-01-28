const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
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
    
    bill:{
        type:Number
    }
},{
    timestamps:true
});

// virtual for a specific order's url
orderSchema.virtual('url').get(function(){
    return `/admin/order/${this._id}`;
});

module.exports = Order = mongoose.model('Order',orderSchema);