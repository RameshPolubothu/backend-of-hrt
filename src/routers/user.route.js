const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const generateToken = require('../middleware/generateTokens');
//register a new user
router.post('/register', async (req, res) => {
    try {
        // check this again once 
        const {email, password,username } = req.body;
        const user = new User({email: email, password:password, username: username});
        // console.log(user);
        await user.save();
        res.status(200).send({
            message : "User registered successfully",
            user: user
        });

    } catch (error) {
        console.log("failed to register new user", error);
        res.status(500).json({message:"failed to register new user",error: error});
    }
});

//login a user
router.post('/login', async (req, res) => {
    try {
        // console.log(req.body);
        const {email,password}= req.body;
        const user = await User.findOne({email:email});
        if(!user){
            res.status(404).send({
                message : "You haven't registed please Signup or check the email again",
            })
        }
        const ismatch = await user.comparePassword(password); // caling the meathod for the user
        if(!ismatch){
            return res.status(401).send({message: "Invalid password"});
        }
        //generate jwt token
        const token = await generateToken(user._id);
        // // console.log(token);
        // // we need to set it on browser cookies
        res.cookie("token", token,{
            httpOnly: true,
            secure: true,
            sameSite: true
        });
        res.status(200).send({
            message:"login sucessful",token,
            user : {
                id:user._id,
                email : user.email,
                username  : user.username,
                role : user.role
            }
        });

    } catch (error) {
        console.log("failed to login user", error);
        res.status(500).json({message:"failed to login user Try again!",error: error});
    }
});

//logout a user
router.post('/logout',async (req,res) => {
    try {
        res.clearCookie("token");
        res.status(200).send({message:"logged out sucessfully done"});
    } catch (error) {
        console.log("Failed to logout",error);
        res.status(500).send({
            message:"failed to logout"
        });
    }
});

//get all users
router.get('/users',async(req,res) => {
    try {
        const users = await User.find({},'id email role');
        res.status(200).send({
            message:"users found sucessfully",
            users:users
        });
    } catch (error) {
        console.log("Failed to get all users",error);
        res.status(500).send({
            message:"failed to get users"
        });
    }
});

//delete a user
router.delete('/users/:id',async(req,res) =>{
    try {
        const userid = req.params.id;
        const deleteuser = await User.findByIdAndDelete(userid);
        if(!deleteuser){
            res.status(404).send({messge:"user not found"});
        }
        res.status(200).send({
            message:"User deleted sucessfully"
        });
    } catch (error) {
        console.log("Failed to delete user",error);
        res.status(500).send({
            message:"failed to delete user"
        });
    }
});

//update a user role
router.put('/users/:id',async(req,res)=>{
    try {
        const id = req.params.id;
        const {role} = req.body;
        const user = await User.findByIdAndUpdate(id,{role},{new:true});
        if(!user){
            res.status(404).send({message:"User not found"});
        }
        res.status(200).send({message:"user role updated sucessfully",user:user});

    } catch (error) {
        console.log("Error Updating user role ",error);
        res.status(500).send({
            message:"Error Updating Role"
        });
    }
});


module.exports = router;