const express = require('express');
const comment = require('../models/comment.model');
const router = express.Router();
const VerifyToken = require("../middleware/Verifytoken");
//create a new comment
router.post('/post-comment', VerifyToken,async (req,res) =>{
    try {
        const newcomment = new comment(req.body);
        await newcomment.save();
        res.status(200).send({ 
            message:"Comment saved successfully",
            post:newcomment
        });
    } catch (error) {
        console.log("error while saving comment");
        res.status(404).send({message: "error creating comment",error});
    }
});

//get all comments
router.get('/total-comments',async (req,res) =>{
    try {
        const numComments = await comment.countDocuments({});
        res.status(200).send({
            message:"Total comments count",
            post : numComments
        });
    } catch (error) {
        console.log("error while counting comment");
        res.status(404).send({message: "error counting comment",error});
    }
});

module.exports = router;