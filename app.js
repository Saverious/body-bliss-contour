require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const connectDb = require('./config/dbConnect');
const session = require('express-session');
const flash = require('connect-flash');
const MongodbStore = require('connect-mongodb-session')(session);
const helmet = require('helmet');
const fileUpload = require('express-fileupload');
const compression = require('compression');
const {sudoAuth}=require('./middlewares/superAuth');
const {logging}=require('./config/logs');

const homeRouter = require('./routes/homeRouter');
const cartRouter = require('./routes/cartRouter');
const adminRouter = require('./routes/adminRouter');
const authRouter = require('./routes/authRouter');
const orderRouter = require('./routes/orderRouter');
const contactRouter = require('./routes/contactRouter');

const app = express();

const store=new MongodbStore(
  {
    uri:process.env.CONSTRING,
    collection:'sessions'
  },
  function(err){
    logging.error(err);
  }
);

store.on('error',function(error){
  logging.error(err);
});

app.set('view engine', 'ejs');

app.use(session({
  secret: process.env.COOKIE_SECRET,
  resave: false,
  saveUninitialized: false,
  store:store
}));
app.use(flash());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload({
  useTempFiles:true
}));
app.use(helmet.contentSecurityPolicy({
  directives:{
    ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "img-src": ["'self'", "res.cloudinary.com", "fonts.gstatic.com", "fonts.googleapis.com"],
  }
}));
app.use(compression());
app.disable('x-powered-by');

app.use('/',homeRouter);
app.use('/cart',cartRouter);
app.use('/auth',authRouter);
app.use('/order',orderRouter);
app.use('/',contactRouter);
app.use('/admin',sudoAuth,adminRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

connectDb()
.then(data=>{
  logging.info(data);
})
.catch(err=>{
  logging.error(err);
});

module.exports=app;