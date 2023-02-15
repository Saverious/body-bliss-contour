exports.fatCav=(req,res,next)=>{
    res.render("user/serviceinfo/fatcav",{
        title:"Fat Cavitation"
    });
}

exports.laserTher=(req,res,next)=>{
    res.render("user/serviceinfo/laserther",{
        title:"Laser Therapy"
    });
}

exports.lymphMass=(req,res,next)=>{
    res.render("user/serviceinfo/lymphmass",{
        title:"Lymphatic Massage"
    });
}

exports.reviews=(req,res,next)=>{
    res.render("user/serviceinfo/reviews",{
        title:"Manicure/Pedicure"
    });
}

exports.skinLight=(req,res,next)=>{
    res.render("user/serviceinfo/skinlight",{
        title:"Skin Lightening"
    });
}

exports.woodTher=(req,res,next)=>{
    res.render("user/serviceinfo/woodther",{
        title:"Wood Therapy"
    });
}