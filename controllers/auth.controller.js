const jwt = require('jsonwebtoken')
const User = require('../models/userModel');
const {catchAsync} = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signup = catchAsync(async (req, res, next) => {
 const newUser = await User.create({
     name : req.body.name,
     email : req.body.email,
     password : req.body.password,
     passwordConfirm : req.body.passwordConfirm
 })

 const token = jwt.sign({id : newUser._id}, process.env.JWT_SECRET, {
     expiresIn : process.env.JWT_EXPIRES_IN
 })


 res.status(201).json({
     status : 'success',
     token,
     data :{
         user : newUser
     }
 })
});


const login = catchAsync(async(req, res, next) => {

    const {email, password} = req.body;

    if(!email || !password){
        return next(new AppError('Please provide email and password', 400))
    }


    const user = await User.findOne({email}).select('+password')

    if(!user){
        return next(new AppError('Password or email incorrect', 401))
    }

    const correct = await user.correctPassword(password, user.password);

    if(!correct){
        return next(new AppError('Password or email incorrect', 401))
    }

    const token = jwt.sign({id : user._id}, process.env.JWT_SECRET, {
        expiresIn : process.env.JWT_EXPIRES_IN
    })
   

    res.status(201).json({
        status : 'success',
        token
    })

});

module.exports = {
    signup,
    login
}