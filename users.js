const mongoose = require('mongoose');
var crypto = require('crypto'); 

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {type: String,
    required: true},
    password: {type: String,
    required: true},
    posts: [
        {
            type: Schema.Types.ObjectId,
            ref: "Post"
        }
    ],
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: "Comment" 
        }
    ],
    hash : String, 
    salt : String 
}, {timestamps: true});

userSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex'); 
    this.hash = crypto.pbkdf2Sync(password, this.salt,  
    1000, 64, `sha512`).toString(`hex`); 
}

userSchema.methods.validPassword = function (password) {
    var hash = crypto.pbkdf2Sync(password,  
    this.salt, 1000, 64, `sha512`).toString(`hex`); 
    return this.hash === hash; 
}


const User = mongoose.model('User', userSchema);

module.exports = User;