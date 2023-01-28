require('dotenv').config();
const sgMail=require('@sendgrid/mail');
const { logging } = require('../config/logs');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// POST- Receive inbound email payload 
exports.inboundMail=async(req,res,next)=>{
    const senderName=req.body.uname;
    const senderEmail=req.body.uemail;
    const about=req.body.subject;
    const message=`<h3>This message is from ${senderEmail}</h3>
    <h4>Subject : ${about}</h4>
    <p>${req.body.message}</p>`;

    const mail={
        from:process.env.SENDGRID_FROM,
        to:process.env.SENDGRID_FROM,
        subject:`${senderName} has contacted Body Bliss Contour`,
        html:message
    }
    
    try{
        await sgMail.send(mail);
        req.flash('contact1','message sent');
        res.redirect('/contact');
    }catch(err){
        logging.error(err);
    }
}