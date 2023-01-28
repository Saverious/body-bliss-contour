const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const { logging } = require('../config/logs');

// GET- View Cart
exports.viewCart = async (req,res,next) => {
    const userId = req.params.id;
    
    try{
        let cart = await Cart.findOne({userId:userId});
        
        if(cart){
            res.render("user/carts/cart",{
                title:"My Cart",
                cart:cart
            });
        }else{
            res.render("user/carts/cartempty",{
                title:"My Cart",
            });
        }
    }
    catch(err){
        logging.error(err);
        res.status(500).send("Something went wrong");
    }
}

//POST - Add item to cart
exports.addToCart = async (req,res,next) => {
    const userId = req.params.id;
    const { productId, quantity } = req.body;

    try{
        let cart = await Cart.findOne({userId:userId});
        let item = await Product.findOne({_id: productId});
        if(!item){
            res.status(404).send('Item not found! Please refresh the page to get the update');
        }else{
            const price = item.price;
            const name = item.name;
            const imgUrl=item.image.url;
            const desc=item.description;
            
            if(cart){
                // if cart exists for the user
                let itemIndex = cart.items.findIndex(p => p.productId == productId);
    
                // Check if product exists or not
                if(itemIndex > -1)
                {
                    let productItem = cart.items[itemIndex];
                    productItem.quantity += 1;
                    cart.items[itemIndex] = productItem;
                }
                else {
                    cart.items.push({ productId, name, desc, imgUrl, quantity, price });
                }
                cart.bill += quantity*price;
                await cart.save().then(()=>{
                    req.flash('addtocart2','Item quantity added to cart successfully');
                    res.redirect('/shopping');
                });
            }else{
                // no cart exists, create one
                const cart = new Cart({
                    userId,
                    items: [{ productId, name,desc, imgUrl, quantity, price }],
                    bill: quantity*price
                });
                await cart.save().then(()=>{
                    req.flash('addtocart1','Item added to cart successfully');
                    res.redirect('/shopping');
                });
            }       
        }
    }
    catch (err) {
        logging.error(err);
        res.status(500).send("Something went wrong");
    }
}

//POST- Delete item from cart
exports.deleteFromCart = async (req,res) => {
    const { productId, cartId, userId } = req.body;
    try{
        let cart = await Cart.findOne({_id:cartId});
        let itemIndex = cart.items.findIndex(p => p.productId == productId);
        if(itemIndex > -1)
        {
            let productItem = cart.items[itemIndex];
            cart.bill -= productItem.quantity*productItem.price;
            cart.items.splice(itemIndex,1);
            await cart.save().then(()=>{
                res.redirect(`/cart/${userId}/mycart`);
            });
        }else{
            res.send('no item to delete');
        }
    }
    catch (err) {
        logging.error(err);
        res.status(500).send("Something went wrong");
    }
}

//POST -Add quantity of cart item
exports.addItemQuantity = async (req,res,next) => {
    const { productId, cartId, userId } = req.body;
    try{
        let cart = await Cart.findOne({_id:cartId});
        let itemIndex = cart.items.findIndex(p => p.productId == productId);
        
        let productItem = cart.items[itemIndex];
        productItem.quantity+=1;
        cart.bill += productItem.price;
        await cart.save().then(()=>{
            res.redirect(`/cart/${userId}/mycart`);
        });
    }
    catch (err) {
        logging.error(err);
        res.status(500).send("Something went wrong");
    }
}

//POST- Reduce quantity of cart item
exports.removeItemQuantity = async (req,res) => {
    const { productId, cartId, userId } = req.body;
    try{
        let cart = await Cart.findOne({_id:cartId});
        let itemIndex = cart.items.findIndex(p => p.productId == productId);
        if(itemIndex > -1)
        {
            let productItem = cart.items[itemIndex];
            if(productItem.quantity>1){
                productItem.quantity-=1;
                cart.bill -= productItem.price;
                await cart.save().then(()=>{
                    res.redirect(`/cart/${userId}/mycart`);
                });
            }else{
                cart.bill -= productItem.price;
                cart.items.splice(itemIndex,1);
                await cart.save().then(()=>{
                    res.redirect(`/cart/${userId}/mycart`);
                });
            }
        }else{
            res.send('Item already deleted.Please refresh the page to get the update');
        }
    }
    catch (err) {
        logging.error(err);
        res.status(500).send("Something went wrong");
    }
}

// when a not-logged-in-user adds item to cart, redirect to login page
exports.notLoggedIn = (req,res,next)=>{
    req.flash('message','You need to log in first to continue with shopping. Create an account if it does not exist');
    res.redirect('/login');
}