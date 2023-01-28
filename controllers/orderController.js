require('dotenv').config();
const Intasend = require('intasend-node');
const sgMail = require('@sendgrid/mail');
const ejs=require('ejs');
const path=require('path');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const User = require('../models/userModel');
const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const { logging } = require('../config/logs');

const intasend=new Intasend(
    publishable_key=process.env.INTASEND_KEY,
    secret_key=process.env.INTASEND_SECRET,
    //test_mode=true
);

exports.intasendCheckout=async(req,res,next)=>{
    try{
        const {userId, currency}=req.body;
        const cart=await Cart.findOne({userId:userId});
        const user=await User.findOne({_id:userId});

        if(currency==='KES'){
            global.CART_BILL_GLOBAL= cart.bill;
        }else{
            global.CART_BILL_GLOBAL=cart.bill/100;
        }

        let collection = intasend.collection();
        collection
        .charge({
            first_name: `${user.name}`,
            last_name: '-',
            email: `${user.email}`,
            currency:currency,
            host: `${process.env.DOMAIN}`,
            amount: CART_BILL_GLOBAL,
        })
        .then(async(resp) => {
            global.CHECKOUT_URL_GLOBAL = `${resp.url}?id=${cart._id}`;
            res.redirect(CHECKOUT_URL_GLOBAL);
        })
        .catch((err) => {
            logging.error(err);
            res.send(`Charge error,please try again`);
        });
    }catch(err){
        logging.error(err);
    }
}

exports.webHook=async(req,res,next)=>{
    try{
        const data=req.body
        if(data.challenge===process.env.CHALLENGE){
            const state=data.state;
            const parsedUrl=new URL(CHECKOUT_URL_GLOBAL);
            const cartId= parsedUrl.searchParams.get('id');
            
            switch(state){
                case 'PENDING':
                    res.send(`Payment pending...`);
                    break;

                case 'PROCESSING':
                    res.send('Processing payment...');
                    break;

                case 'COMPLETED':
                    const cart=await Cart.findOne({_id:cartId});
                    const user=await User.findOne({_id:cart.userId});
                    const order=new Order({
                        userId:user._id,
                        items:cart.items,
                        bill:cart.bill
                    });

                    await order.save()
                    .then(async()=>{
                        await Cart.findByIdAndDelete(cartId).then(async()=>{
                            const customer= await User.findOne({_id:order.userId});

                            // created_at fetched from webhook payload
                            const time=data.created_at;
                            const newTime=new Date(time);
                            const finalDate= newTime.getDate() + "/" + (newTime.getMonth()+1) + "/" + newTime.getFullYear();
                            const finalTime= newTime.getHours() + ":" + newTime.getMinutes() + ":" + newTime.getSeconds();

                            const emailTemp=await ejs.renderFile(path.join(__dirname,"../views/mails/order.ejs"),{
                                data:order.items,
                                orderId:order._id,
                                invoiceid:data.invoice_id,
                                bill:data.value,
                                date:finalDate,
                                time:finalTime,
                                name:customer.name,
                                email:customer.email,
                                phone:data.account,
                                method:data.provider,
                                currency:data.currency
                            });
                            
                            const message={
                                to:process.env.ADMIN_EMAIL,
                                from:process.env.SENDGRID_FROM,
                                subject:'New Order',
                                html : emailTemp
                            }

                            await sgMail.send(message);
                            res.json(order);
                        });
                    })
                    .catch(err=>{
                        logging.error(err);
                    });

                    break;

                case 'FAILED':
                    res.send('Payment failed!');
                    break;

                default:
                    res.send('Payment pending...');
                    break;
            }
        }else{
            res.send('Error while authenticating payload');
        }
    }catch(err){
        logging.error(err);
        res.json('Sorry,An error occurred. Please try again later');
    }
}