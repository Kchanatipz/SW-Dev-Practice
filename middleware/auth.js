const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect user
exports.protect = async (req,res,next) => {
    let token;

    if (req.headers.authorization &&  req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // Make sure token exists
    if (!token) {
        return res.body(401).json({success: false, msg: 'Not authorize to access this route'});
    }

    try {
        // Verify token
        const decoded = jwt.verify(token,process.env.JWT_Secret);
        console.log(decoded);
        req.user = await User.findById(decoded.id);

        next();
    } catch(err) {
        console.log(err);
        return res.status(401).json({success: false, msg: 'Not authorize to access this route'});
    }
}