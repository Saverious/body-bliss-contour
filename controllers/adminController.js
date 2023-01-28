const cloudinary = require('../config/image');
const Customer = require('../models/userModel');
const Product = require('../models/productModel');
const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const {logging} = require('../config/logs');

exports.adminHome=(req,res,next)=>{
    res.redirect('/admin/products')
}

exports.adminProducts=async(req,res,next)=>{
    try{
        const products = await Product.find();
        res.render("admin/products",{
            title:"My Products",
            data: products,
            remove:req.flash('deleted'),
            updated:req.flash('updated')
        });
    }catch(err){
        logging.error(err);
    }
}

exports.adminOrders=async(req,res,next)=>{
    try{
        const order = await Order.find();
        res.render("admin/orders",{
            title:"Orders",
            data:order
        });
    }catch(err){
        logging.error(err);
    }
}

exports.adminCarts=async(req,res,next)=>{
    try{
        const cart = await Cart.find();
        res.render("admin/carts",{
            title:"Carts",
            data:cart
        });
    }catch(err){
        logging.error(err);
    }
}

exports.customers=async(req,res,next)=>{
    try{
        const customer = await Customer.find();
        res.render("admin/customers",{
            title:"Customers",
            data:customer
        });
    }catch(err){
        logging.error(err);
    }
}

// GET- Details of a user
exports.customerDetail=async(req,res,next)=>{
    try{
        const customerId=req.params.id;
        const customer=await Customer.findOne({_id:customerId});
        const cart=await Cart.findOne({userId:customerId});
        const order=await Order.findOne({userId:customerId});
        res.render("admin/customerdetail",{
            title:"Customer- Detailed",
            data:customer,
            cart:cart,
            order:order
        });
    }catch(err){
        logging.error(err);
    }
}

// GET- Details of a cart
exports.cartDetail=async(req,res,next)=>{
    try{
        const cartId=req.params.id;
        const cart=await Cart.findOne({_id:cartId});
        if(cart){
            const customer=await Customer.findOne({_id:cart.userId});
            res.render("admin/cartdetail",{
                title:"Cart- Detailed",
                data:cart,
                user:customer
            });
        }else{
            res.render("admin/emptycartdetails",{
                title:"Cart- Detailed"
            });
        }
    }catch(err){
        logging.error(err);
    }
}

// GET- Details of an order
exports.orderDetail=async(req,res,next)=>{
    try{
        const orderId=req.params.id;
        const order=await Order.findOne({_id:orderId});
        if(order){
            const customer=await Customer.findOne({_id:order.userId});
            res.render("admin/orderdetail",{
                title:"Order- Detailed",
                data:order,
                user:customer
            });
        }else{
            res.render("admin/emptyorderdetail",{
                title:"Order- Detailed"
            });
        }
    }catch(err){
        logging.error(err);
    }
}

//GET- Add product form
exports.addItemForm=(req,res,next)=>{
    res.render("admin/additem",{
        title:"Add Product",
        added:req.flash('added')
    });
}

//POST- Add item
exports.addProduct=async(req,res,next)=>{
    const {pname,pprice,pdesc}=req.body;
    const img=req.files.pimg.tempFilePath;
    try{
        const data=await cloudinary.uploader.upload(img,{
            public_id:`${Date.now()}`,
            /*eager:[
                {width:140,height:120}
            ]*/
        });
        const product=new Product({
            name:pname,
            price:pprice,
            image:{
                url:data.secure_url
            },
            description:pdesc
        });

        await product.save().then(()=>{
            req.flash('added','Product added successfully');
            res.redirect('/admin/add/product');
        });
    }catch(err){
        logging.error(err);
    }
}

// POST- Delete product
exports.deleteProduct=async(req,res,next)=>{
    try{
        const id=req.params.id;
        await Product.findByIdAndDelete(id).then(()=>{
            req.flash('deleted','Product deleted successfully');
            res.redirect('/admin/products');
        });
    }catch(err){
        logging.error(err);
    }
}

// GET- Edit product
exports.editProduct=async(req,res,next)=>{
    try{
        const id=req.params.id;
        const product=await Product.findOne({_id:id});
        res.render("admin/editproduct",{
            title:"Edit",
            item:product
        });
    }catch(err){
        logging.error(err);
    }
}

// POST- Edit product
exports.updateProduct=async(req,res,next)=>{
    try{
        const id=req.params.id;
        const{pname,pprice,pdesc}=req.body;
        const pimg=req.files.pimg.tempFilePath;
        try{
            const data=await cloudinary.uploader.upload(pimg,{
                public_id:`${Date.now()}`,
                /*eager:[
                {width:140,height:120}
                ]*/
            });
            await Product.findByIdAndUpdate(id,{
                name:pname,
                price:pprice,
                image:{
                    url:data.secure_url
                },
                description:pdesc
            },{new:true}).then(()=>{
                req.flash('updated','Product updated successfully');
                res.redirect('/admin/products');
            });
        }catch(err){
            logging.error(err);
        }
    }catch(err){
        logging.error(err);
    }
}