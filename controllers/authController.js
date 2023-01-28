require('dotenv').config();
const sgMail=require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const otpGen=require('otp-generator');
const bcrypt=require('bcrypt');
const { validationResult } = require('express-validator');
const ejs=require('ejs');
const path=require('path');
const OTP=require('../models/otpModel');
const User=require('../models/userModel');
const {logging}=require('../config/logs');


// POST- User Sign Up
exports.signUp=async(req,res,next)=>{
    try{
        const {uname, uemail}=req.body;
        const name=await User.findOne({name:uname});
        const email=await User.findOne({email:uemail});
        if(name){
            req.flash('taken-username','Username already taken');
            res.redirect('/login');
        }else{
            if(email){
                req.flash('taken-email','Email already exists');
                res.redirect('/login');
            }else{
                const otp=otpGen.generate(6,{
                    upperCaseAlphabets:true,
                    lowerCaseAlphabets:true,
                    specialChars:false
                });
        
                const hash=await bcrypt.hash(otp,12);
                const user=new User({
                    name:uname,
                    email:uemail,
                    password:hash
                });
        
                const emailTemp=await ejs.renderFile(path.join(__dirname,"../views/mails/welcome.ejs"),{
                    link:`${process.env.DOMAIN}/signup`,
                    otp:`${otp}`
                }); 
                
                const message={
                    to:uemail,
                    from:process.env.SENDGRID_FROM,
                    subject:"Verify account",
                    text:"Confirm account setup below",
                    html:emailTemp
                }
        
                await user.save().then(async()=>{
                    await sgMail.send(message).then(()=>{
                        req.flash('welcome',`An email has been sent to ${uemail}. View it to set password to protect your account`);
                        res.redirect('/login');
                    })
                })
            }
        }
    }catch(err){
        logging.error(err);
    }
}

// POST- Confirm User-signup
exports.verifyAccount=async(req,res,next)=>{
    try{
        const{uemail,otpass,newpass}=req.body;
        const user=await User.findOne({email:uemail});
        if(!user){
            res.send('There is no user with the given email address. Please confirm your email address');
        }else{
            bcrypt.compare(otpass,user.password,async(error,result)=>{
                if(result===true){
                    const hash=await bcrypt.hash(newpass,12);
                    await User.findOneAndUpdate(user._id,{password:hash},{new:true}).then(()=>{
                        if(uemail===process.env.ADMIN_EMAIL){
                            req.session.sudo=user.name;
                            req.session.save(()=>{
                                res.send('Your account has been verified. Go back to main page');
                            });
                        }else{
                            req.session.user=user.name;
                            req.session.save(()=>{
                                res.send('Your account has been verified. Go back to main page');
                            });
                        }
                    });
                }else{
                    res.send('Invalid or expired one time password');
                }
            });
        }
    }catch(err){
        logging.error(err);
    }
}

// POST- Authenticate user-login
exports.login=async(req,res) =>{
    try{
        const {uname,upass}=req.body;
        const errors=validationResult(req);

        if(!errors.isEmpty()){
            logging.error(err);
            res.send('A fatal error occured!');
            return;
        }else{
            const user=await User.findOne({name:uname});
        
            if(user){
                bcrypt.compare(upass,user.password,(err,result)=>{
                    if(result===true){
                        req.session.regenerate(()=>{
                            if(user.email===process.env.ADMIN_EMAIL){
                                req.session.sudo=uname;
                                req.session.save(()=>{
                                    res.redirect('/');
                                });
                            }else{
                                req.session.user=uname;
                                req.session.save(()=>{
                                    res.redirect('/');
                                });
                            }
                        });
                    }else{
                        req.flash('invalid-psk1','Incorrect password');
                        res.redirect('/login');
                    }
                });
            }else{
                req.flash('invalid-user','User does not exist');
                res.redirect('/login');
            }
        }
    }catch(err){
        logging.error(err);
    }
}

// POST- Password reset request
exports.resetPassReq=async(req,res,next)=>{
    try{
        const {uemail}=req.body;
        const user=await User.findOne({email:uemail});
        if(!user){
            req.flash('message1','Invalid email address');
            res.redirect('/password-reset');
        }else{
            const otp=otpGen.generate(6,{
                upperCaseAlphabets:true,
                lowerCaseAlphabets:true,
                specialChars:false
            });
    
            const hash=await bcrypt.hash(otp,12);
    
            const otpModel=new OTP({
                userId:user._id,
                otp:hash
            });
    
            await otpModel.save();
            
            const html=`<p>
            <h3> Hello ${user.name} </h3> <br/> A request has been made to reset your account password.
             If this was not you,simply ignore this email. If you did authorize this request, click
             <a href="${process.env.DOMAIN}/auth/password/reset">here</a> to continue with password reset. 
             Use <strong style="color:blue;">${otp}</strong> as your One Time Password. <h3>Note</h3>This one time 
             password expires in 5 minutes and can no longer be used thereafter.
             </p>`

            const message={
                to:user.email,
                from:process.env.SENDGRID_FROM,
                subject:'Password reset!',
                html:html
            }
            
            await sgMail.send(message).then(()=>{
                req.flash('message2','A link has been sent to your email address to reset your password. The link expires in 5 minutes');
                res.redirect('/password-reset');
            });
        }
    }catch(err){
        logging.error(err);
    }
}

//GET -Password reset form
exports.resetPassForm=(req,res,next)=>{
    res.render("user/pages/changepass",{
        title:"Reset Password",
    });
}

//POST -Password reset form
exports.changePass=async(req,res,next)=>{
    try{
        const {uemail,otpass,newpass}=req.body;
        const user=await User.findOne({email:uemail});
        if(!user){
            res.send('Invalid email address');
        }else{
            const otpHash=await OTP.findOne({userId:user._id});
            if(!otpHash){
                res.send('Your One time password has already expired!');
            }else{
                bcrypt.compare(otpass,otpHash.otp,async(err,result)=>{
                    if(result===true){
                        const hash=await bcrypt.hash(newpass,12);
                        await User.findOneAndUpdate(user._id,{password:hash},{new:true}).then(async()=>{
                            await OTP.findOneAndDelete({userId:user._id}).then(()=>{
                                req.flash('message','Your password has been reset successfully');
                                res.redirect('/login');
                            });
                        });
                    }else{
                        res.send('Invalid one time password');
                    }
                });
            }
        }
    }catch(err){
        logging.error(err);
        res.send('Error while resetting password! Please try again');
    }
}