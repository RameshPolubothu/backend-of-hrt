const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema  = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : true
    },
    email :{
        type: String,
        required : true,
        unique : true,
        // match : [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    password :{
        type : String,
        required : true,
    },
    role:{
        type : String,
        default : 'user'
    },
    createdAt:{
        type: Date,
        default : Date.now
    }
});

//hash the password before saving in database

UserSchema.pre('save', async function(next){
    const user = this;
    if(!user.isModified('password')){
        return next();
    }
    const hashedpassword = await bcrypt.hash(user.password,10); // saltnumber 10
    user.password = hashedpassword;
    next();


});

//compare the password

UserSchema.methods.comparePassword = function(givenpassword){
    return bcrypt.compare(givenpassword, this.password);
}

const User = mongoose.model('User', UserSchema);

module.exports = User;