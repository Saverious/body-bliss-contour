const express = require('express');
const router = express.Router();
const { body} = require('express-validator');

const{authLimit}=require('../middlewares/rateLimit');

const{ 
    signUp,
    verifyAccount,
    login,
    resetPassReq,
    resetPassForm,
    changePass
} = require('../controllers/authController');

router.post('/password-reset-link',resetPassReq);
router.get('/password/reset',resetPassForm);
router.post('/new-password',changePass);

router.post('/login', authLimit,
// validate and sanitize form
body('uname', 'username must be filled')
.not()
.isEmpty()
.trim()
.escape(),

body('upass', 'password must have a minimum of 8 characters')
.trim()
.isLength({min:8})
.escape(),

// login controller if no errors are found
login);

router.post('/signup', authLimit,
body('uname', 'username must be filled')
.not()
.isEmpty()
.trim()
.escape(),

body('uemail')
.not()
.isEmpty()
.trim()
.isEmail()
.normalizeEmail()
.escape(),

// signup controller if no errors are found
signUp);

router.post('/confirm-signup',verifyAccount);

module.exports = router;