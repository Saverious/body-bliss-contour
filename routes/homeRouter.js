const express = require('express');
const router = express.Router();
const {
    homePage,
    aboutPage,
    servicesPage,
    contactPage,
    shoppingPage,
    loginPage,
    signupPage
} = require('../controllers/homeController');

const {
    fatCav,
    laserTher,
    lymphMass,
    manicure,
    skinLight,
    woodTher
} = require("../controllers/serviceInfoController");

// routes to main pages
router.get('/',homePage);
router.get('/about',aboutPage);
router.get('/services',servicesPage);
router.get('/contact',contactPage);
router.get('/shopping',shoppingPage);
router.get('/login',loginPage);
router.get('/signup',signupPage);

// routes to serviceinfo pages
router.get("/services/fatcavitation",fatCav);
router.get("/services/lasertherapy",laserTher);
router.get("/services/lymphaticmassage",lymphMass);
router.get("/services/manicure",manicure);
router.get("/services/skinlightening",skinLight);
router.get("/services/woodtherapy",woodTher);


module.exports = router;