const mongoose = require('mongoose');
const BlogSchema  = new mongoose.Schema({
    title : {
        type: String,
        required: true
    },
    description:{
        type : String
    },
    content :{
        type: Object,
        required: true
    },
    coverImg:{
        type: String
    },
    category:String,
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    rating:Number,
    createdAt:{
        type:Date,
        default:Date.now
    }
}
// ,{timestamps:true}
);

const Blog = mongoose.model('Blog',BlogSchema);

module.exports = Blog;