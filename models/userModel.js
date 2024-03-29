const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    name : {
        type : String,
        required : [true, 'Please tell us your Name']
    },
    email : {
        type : String,
        required : [true, 'Please provide your email'],
        unique: true,
        lowercase : true,
        validate : [validator.isEmail, 'Please provide a valid email']
    },
    photo : String,
    password: {
        type : String,
        required : [true, 'Please provide a password'],
        minlength : 8,
        select : false
    },
    passwordConfirm : {
        type : String,
        required : [true, 'Please confirm your password'],
        validate: {
            validator: function(el){
                return el === this.password
            },
            message : "Password are not same"
        }
    }
})


userSchema.pre('save', async function(next){
    // eslint-disable-next-line dot-notation
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12)

    this.passwordConfirm = undefined;

    next();
})


userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword);
}

const User = mongoose.model('User', userSchema);

module.exports = User