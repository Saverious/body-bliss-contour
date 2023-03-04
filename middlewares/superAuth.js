exports.sudoAuth=(req,res,next)=>{
    if(req.session.sudo){
        next();
    }else{
        res.send('<h1>Not Found</h1>');
    }
}