const express = require('express');

const { body } = require('express-validator');
const userController = require('../controller/usercontroller');
const router = express.Router();

router.post('/register',
    body('first_name').isString(),
    body('last_name').isString(),
    body('email').isEmail(),
    body('password', 'Password must be greater than 8 and contain at least one uppercase letter, one lowercase letter, and one number').isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    }), userController.registerUser);

router.post('/login',
    body('email').isEmail(),
    body('password', 'Password has to be valid').isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    }),
    userController.LoginUser);

router.post('/verify',
    body('email').isEmail(),
    userController.verify);

router.post('/verifyotp',
    body('email').isEmail(),
    body('otp').isString(),
    userController.verifyotp)
module.exports = router;