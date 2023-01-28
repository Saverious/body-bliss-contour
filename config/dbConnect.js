require('dotenv').config();
const mongoose=require('mongoose');
const url=process.env.CONSTRING;

const connectDb=()=>{
    return new Promise((resolve)=>{
        mongoose.connect(url,{useNewUrlParser:true, useUnifiedTopology:true});
        resolve('connected to database');
    });
}

module.exports=connectDb;