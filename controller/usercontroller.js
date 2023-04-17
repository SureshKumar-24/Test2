const bcrypt = require('bcrypt');
const db = require('../models');
const Userotp = db.UserOtp;
const User = db.User;
const moment = require('moment');
const nodemailer = require('nodemailer');
const { validationResult } = require("express-validator");


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'nickm2878@gmail.com',
        pass: 'kdmgpvsgvcdqzica'
    }
});

module.exports.registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        //chech the email is already registered or not
        const check_email = await User.findOne({ where: { email: req.body.email } });
        if (check_email) {
            return res.status(200).json({ errors: 'email is already exists' });
        }
        const hashPassword = await bcrypt.hash(req.body.password, 12);

        const user = await User.create({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            password: hashPassword,
            address: req.body.address,
            isVerified: false
        })

        const otp = Math.floor(Math.random() * 899999 + 100000);
        const expiryTime = moment().add(1, 'm').format("YYYY-MM-DD hh:mm:ss");
        await transporter.sendMail({
            to: req.body.email,
            from: 'nickm2878@gmail.com',
            subject: 'Verification Process',
            html: `<h1>Click on the link for verification</h1>
                <p>${otp}</p>`
        });

        const otpg = await Userotp.create({
            email: user.email,
            otp: otp,
            expire_at: expiryTime
        })

        res.status(200).json({
            success: "",
            msg: "",
            data: user,
            otp: otpg
        })
    }
    catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
};

exports.verify = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const email = req.body.email;
        const user = await User.findOne({ where: { email: email } });

        if (!user) {
            return res.status(400).json({ errors: 'User in not Found!!!' });
        }
        const otp = Math.floor(Math.random() * 899999 + 100000);

        await transporter.sendMail({
            to: email,
            from: 'nickm2878@gmail.com',
            subject: 'Verification Process',
            html: `<h1>Click on the link for verification</h1>
                <p>${otp}</p>`
        });

        const expiryTime = moment().add(1, 'm').format("YYYY-MM-DD hh:mm:ss ");
        const otpstore = await Userotp.create({
            email: email,
            otp: otp,
            expire_at: expiryTime
        })

        res.json({
            msg: "Otp send to registred email Successfully",
            data: otpstore.otp
        })
    }
    catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
}

//verify the otp
exports.verifyotp = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, otp } = req.body;
    try {

        const otpdata = await Userotp.findOne({
            limit: 1,
            where: { email, otp },
            order: [['createdAt', 'DESC']],
        });

        const now = moment().format("YYYY-MM-DD hh:mm:ss");
        const expiretime = otpdata.expire_at;
        var isAfter = moment(now).isAfter(expiretime);

        if (!otpdata) {
            return res.json({ msg: "Your otp is incorrect" });
        }
        else if (otpdata && isAfter) {
            return res.json({ msg: "Your otp is expired" });
        }


        const user = await User.findOne({
            where: { email }
        });

        if (user) {
            otpdata.expire_at = now;
            await User.update(
                {
                    isVerified: 1,
                },
                {
                    where: { email: email },
                }
            );
        }
        return res.json({ msg: "You are successfully verified and now you can login" });
    }
    catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
}

module.exports.LoginUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email: email } });

        if (!user) {
            return res.status(400).json({ errors: 'User in not Found!!!' });
        }
        const matchPassword = await bcrypt.compare(password, user.password);
        if (!matchPassword) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        if (user.isVerified == "0") {
            return res.status(401).send({
                message: "Pending Verification. Please Verify Your Email!",
            });
        }
        return res.status(200).json({
            msg: "User successfully logged ",
            data: user,

        })
    }
    catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
};
