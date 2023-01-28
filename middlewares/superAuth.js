exports.sudoAuth=(req,res,next)=>{
    if(req.session.sudo){
        next();
    }else{
        res.send('<h1>404 Not Found</h1>');
    }
}