const Product = require('../models/productModel');
const upload = require('../config/multer');

// CREATE-GET : get create-product form
exports.getProduct=(req,res,next)=>{
    res.render("admin/create",{
        title:"Add Product"
    });
}

// CREATE-POST : Handle add-new-product form
exports.createProduct=(req,res,next)=>{
    upload(req,res,(error)=>{
        if(error){
          res.send('error uploading file');
        }else{
            const {
                product_name,
                product_price,
                product_desc,
            } = req.body;

            const product = new Product({
                name:product_name,
                price:product_price,
                description:product_desc,
                image:{
                    public_id:req.file.public_id,
                    url: req.file.path
                }
            });

            product.save((err)=>{
                if (err){
                    console.log(err);
                }else{
                    res.redirect('/admin/product');
                }
            });
        }
      });
}

// READ - Get all products displayed
exports.adminPage=async(req,res,next)=>{
    const product=await Product.find({}).exec();
    if(product.length>0){
        res.render("admin/allproducts",{
            title:"Admin",
            data:product
        });
    }else{
        res.send('no products available');
    }
}

// UPDATE-GET -View update-product-form
exports.updateProductGET=async(req,res,next)=>{
    const product=await Product.findById(req.params.id);
    if(product){
        res.render("admin/update",{
            title:"Update Product",
            data:product
        });
    }else{
        res.send(`Fatal:Could not find product with ID ${req.params.id}`);
    }
}

// UPDATE-POST -Handle update-product-form
exports.updateProductPost=async(req,res,next)=>{
    const { product_name,product_price,product_desc } = req.body;
    const query={_id:req.params.id};
    const update={ $set :{
        name:product_name,
        price:product_price,
        description:product_desc
    } };

    await Product.findOneAndUpdate(query,update,{new:true});
    if(err){
        console.log(err);
        res.send('error updating product');
    }else{
        res.redirect('/admin/product');
    }
}

// DELETE -Delete existing product
exports.deleteProduct=async(req,res,next)=>{
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/admin/product');
}