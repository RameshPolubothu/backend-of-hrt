const jwt = require('jsonwebtoken');
const User = require('../models/User.model')
const JWT_KEY  = process.env.JWT_SECRET_KEY;

const generateToken = async (givenid) =>{
    try {
        const user = await User.findById(givenid);
        if(!user){
            throw new Error('user not found');
        }
        //if found generate token
        const token = jwt.sign({userId:user._id,role:user.role},JWT_KEY,{expiresIn: '1h'});
        return token;
    } catch (error) {
        console.log("Error generating Token",error);
        throw error;
    }
};

module.exports = generateToken;