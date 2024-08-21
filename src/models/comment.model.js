const mongoose = require('mongoose');
const commentSchema = new mongoose.Schema({
    comment : {
        type : String,
        required : true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    postId:{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Blog',
        required : true
    },
    CreatedAt:{
        type:Date,
        default: Date.now
    }
});

const comment = mongoose.model('comment',commentSchema);
module.exports = comment;