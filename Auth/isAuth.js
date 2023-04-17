const jwt = require('jsonwebtoken');
require("dotenv").config();

const verify = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    try {
        if (typeof bearerHeader !== 'undefined') {
            const bearerToken = bearerHeader.split(' ');
            const token = bearerToken[1];
            jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
                if (err) {
                    return res.send('Token is not Valid');
                }
                req.user = payload.payload;
                console.log(req.user);
                next();
            })
        }
    }
    catch (error) {
        res.status(400).json({
            message: 'Token is not passing'
        })
    }
}
module.exports = verify;