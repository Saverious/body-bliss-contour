const rateLimit=require('express-rate-limit');

exports.authLimit=rateLimit({
    windowMs: 5 * 60 * 1000,
    max:5,
    standardHeaders:true,
    legacyHeaders:false,
    message:'Too many failed attempts. Try again in 5 minutes'
});