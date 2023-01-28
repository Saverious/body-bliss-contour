const express = require('express');
const router = express.Router();

const {
    homePage,
    aboutPage,
    servicesPage,
    shoppingPage,
    contactPage,
    loginPage,
    verifyAccount,
    resetPassword,
    privPolicyPage,
    renderEmptyCart
} = require("../controllers/homeController");

const {
    fatCav,
    laserTher,
    lymphMass,
    reviews,
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
router.get('/signup',verifyAccount);
router.get('/password-reset',resetPassword);
router.get('/privacy-policy',privPolicyPage);
router.get('/mycart',renderEmptyCart);

// routes to serviceinfo pages
router.get('/services/fatcavitation',fatCav);
router.get('/services/lasertherapy',laserTher);
router.get('/services/lymphaticmassage',lymphMass);
router.get('/services/consultations',reviews);
router.get('/services/skinlightening',skinLight);
router.get('/services/woodtherapy',woodTher);

module.exports = router;