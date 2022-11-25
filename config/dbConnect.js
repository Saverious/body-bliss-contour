const mongoose=require('mongoose');
require('dotenv').config();
const url=process.env.CONSTRING;

const connectDb=(req,res)=>{
    return new Promise((resolve)=>{
        mongoose.connect(url,{useNewUrlParser:true, useUnifiedTopology:true});
        resolve('connected to database');
    });
}

module.exports=connectDb;