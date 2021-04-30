var express = require('express');
var router = express.Router();
const passport = require('passport');
const googleLogin = require('../functions/googleLogin');
googleLogin()
const controller = require('../controllers/loginController');



const {processRegister,logIn,processLogin,profile,fatality} = require("../controllers/logInController");
const registerValidation = require('../validations/registerValidation');
const loginValidation = require('../validations/loginValidation');
const userCheck = require("../middlewares/userCheck");
const cookieCheck = require("../middlewares/cookieCheck");


router.post('/log-in',loginValidation,cookieCheck,processLogin);

router.post('/register',registerValidation, processRegister);

router.get('/logout', fatality);

router.get('/', logIn);



/* GOOGLE LOGIN */
router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/users' }), controller.loginGoogle);





module.exports = router;
