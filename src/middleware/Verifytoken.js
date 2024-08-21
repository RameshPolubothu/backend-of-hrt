const jwt = require('jsonwebtoken');
const JWT_KEY  = process.env.JWT_SECRET_KEY;

const VerifyToken = (req,res,next) => {
    try {
        // const token2 = req.headers['authorization'];
        const token = req.cookies.token;
        // const token = req.headers.authorization?.split(' ')[1]; // beamer token
        if(!token) {
            return res.status(401).send({message:"No token provided"});
        }
        // console.log(token2);
        const decoded = jwt.verify(token,JWT_KEY);
        if(!decoded.userId) {
            return res.status(401).send({message:"Invaild token provided"});
        }
        req.userId = decoded.userId;
        req.role = decoded.role;
        next();
        
    } catch (error) {
        console.log("error verfying token", error);
        res.status(401).send({message:"error verifying token"});
    }
};

module.exports = VerifyToken;
