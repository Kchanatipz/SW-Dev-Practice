const User = require('../models/User');

// desc     Register user
// route    POST /api/v1/auth/register
// access   Public
exports.register = async(req,res,next) => {
    // res.status(200).json({success: true});
    try {
        const {name,email,password,role} = req.body;

        //Create user
        const user = await User.create({
            name,
            email,
            password,
            role
        });
        
        // Create (JWT) token
        const token = user.getSignedJWTToken();

        res.status(200).json({success: true,token});
    } catch(err) {
        res.status(400).json({success: false});
        console.log(err.stack);
    }
}