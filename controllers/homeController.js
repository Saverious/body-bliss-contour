const Product = require('../models/productModel');

exports.homePage=(req,res,next)=>{
    res.render("user/pages/home",{
        title:"Body Bliss Contour-Kenya"
    });
}

exports.aboutPage=(req,res,next)=>{
    res.render("user/pages/about",{
        title:"About Us"
    });
}

exports.servicesPage=(req,res,next)=>{
    res.render("user/pages/services",{
        title:"Services-Body Bliss Contour"
    });
}

exports.shoppingPage=async(req,res,next)=>{
    const product=await Product.find({});
    if(product.length>0){
        res.render("user/pages/shopping",{
            title:"Shop Now",
            data:product
        });
    }else{
        res.send('No products available currently');
    }
}

exports.contactPage=(req,res,next)=>{
    res.render("user/pages/contact",{
        title:"Contact Us"
    });
}

exports.loginPage=(req,res,next)=>{
    res.render("user/pages/login",{
        title:"Login"
    });
}

exports.signupPage=(req,res,next)=>{
    res.render("user/pages/signup",{
        title:"Sign Up"
    });
}