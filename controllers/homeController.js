require('dotenv').config();
const sgMail=require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRIG_KEY);
const Product = require('../models/productModel');
const User = require('../models/userModel');
const async = require('async');
const { logging } = require('../config/logs');

exports.homePage=(req,res,next)=>{
    res.render("user/pages/home",{
        title:"Body Bliss Contour"
    });
}

exports.aboutPage=(req,res,next)=>{
    res.render("user/pages/about",{
        title:"About Us-Body Bliss Contour"
    });
}

exports.servicesPage=(req,res,next)=>{
    res.render("user/pages/services",{
        title:"Services-Body Bliss Contour"
    });
}

exports.shoppingPage=async(req,res,next)=>{
    const userName=req.session.user;
    const superUser=req.session.sudo;
    
    try{
        async.parallel(
            {
                product(callback){
                    Product.find({}).exec(callback);
                },
                user(callback){
                    User.findOne({name:userName}).exec(callback);
                },
                admin(callback){
                    User.findOne({name:superUser}).exec(callback);
                }
            },function(err,results){
                if(err){
                    logging.error(err);
                }else{
                    res.render("user/pages/shopping",{
                        title:"Shop now-Body Bliss Contour",
                        data:results.product,
                        user:results.user,
                        admin:results.admin,
                        message1:req.flash('addtocart1'),
                        message2:req.flash('addtocart2')
                    });
                }
            }
        );
    }catch(err){
        logging.error(err);
    }
}

exports.contactPage=(req,res,next)=>{
    res.render("user/pages/contact",{
        title:"Contact Us-Body Bliss Contour",
        contact1:req.flash('contact1')
    });
}

exports.loginPage=(req,res,next)=>{
    res.render("user/pages/login",{
        title:"Login-Body Bliss Contour",
        message1:req.flash('message'),
        message2:req.flash('welcome'),
        message3:req.flash('invalid-user'),
        message4:req.flash('invalid-psk1'),
        message5:req.flash('taken-username'),
        message6:req.flash('taken-email')
    });
}

exports.verifyAccount=(req,res,next)=>{
    res.render("user/pages/verifyacc",{
        title:"Sign Up",
    });
}

exports.renderEmptyCart=(req,res,next)=>{
    res.render("user/carts/cartempty",{
        title:"Cart-Body Bliss Contour",
    });
}

exports.privPolicyPage=(req,res,next)=>{
    res.render("user/pages/privacy",{
        title:"Privacy Policy-Body Bliss Contour"
    });
}

// A form to request password reset
exports.resetPassword=(req,res,next)=>{
    res.render("user/pages/resetpass",{
        title:"Reset Password-Body Bliss Contour",
        message1:req.flash('message1'),
        message2:req.flash('message2')
    });
}