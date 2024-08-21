const express = require('express');
const mongoose  = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
//parser options
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json({limit:'10mb'}));
app.use(bodyParser.urlencoded({limit:'10mb',extended:true}));
app.use(cors({
    origin: 'https://frontend-of-hrt.vercel.app',
    credentials:true,
}));
//user routes
const userroutes = require('./src/routers/user.route');
app.use('/api/auth',userroutes);

//blog routes
const blogroutes = require('./src/routers/blog.route');
app.use('/api/blogs',blogroutes);
//comment routes
const commentroutes = require('./src/routers/comment.route');
app.use('/api/comments',commentroutes);



async function main() {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Successfully connected to the database');
    } catch (err) {
        console.log('Error connecting to the database:', err);
    }
}

main();


app.listen(port, () => {
    console.log(`listening on port:${port}`);
})
