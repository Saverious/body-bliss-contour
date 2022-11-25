const User=require('../models/userModel');
const bcrypt=require('bcrypt');
const { validationResult } = require('express-validator');


exports.signUp=(req,res,next)=>{
    const { uname,uemail,upass } =req.body;

    const errors= validationResult(req);

    if(!errors.isEmpty()){
        res.render('user/signup',{
            title:'Sign Up',
            //user,
            errors:errors.array()
          });
          return;
    }else{
        bcrypt.hash(upass,12,(err,hash)=>{
            if (err) next (err);
    
            const user=new User({
                name:uname,
                email:uemail,
                password:hash
            })
    
        User.find({name:uname}).exec((err,data)=>{
            if(err) next(err);
            if(data.length>0){
                res.send('username already taken')
            }else{
                user.save((err)=>{
                    if(err) next(err)
                    req.session.user=uname
                    req.session.save((err)=>{
                        if(err) next(err)
                        res.redirect('/')
                    })
                })
            }
        })
     })
    
    }
};

exports.login=async(req,res,next) =>{
    const {uname,upass}=req.body;

    const errors=validationResult(req);

    if(!errors.isEmpty()){
        res.render('user/login',{
            title:'Login',
            //user,
            errors:errors.array()
          });
          return;
    }else{
        const user=await User.findOne({name:uname});
        
        if(user){
            bcrypt.compare(upass,user.password,(err,result)=>{
                if(err){
                    console.log(err);
                };
                if(result===true){
                    req.session.regenerate((err)=>{
                        if (err){
                            console.log(err);
                        };
                        req.session.user=uname;
                        req.session.save((err)=>{
                            if (err){
                                console.log(err);
                            };
                            res.redirect('/');
                        });
                    });
                }else{
                    res.json('incorrect password');
                }
            });
        }else{
            res.json('user does not exist')
        }
    }
}