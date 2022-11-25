const express = require('express');
const router = express.Router();
const { body} = require('express-validator');

const{ login,signUp } = require('../controllers/authController');

router.post('/login',
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

// login controller
login);

router.post('/signup',
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

module.exports = router;