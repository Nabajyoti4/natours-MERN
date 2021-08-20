const express = require('express');

const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/user.controller');

const {signup, login} = require('../controllers/auth.controller');


const userRouter = express.Router();

userRouter.route('/signup').post(signup)
userRouter.route('/login').post(login)

userRouter.route('/').get(getAllUsers).post(createUser);

userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = {
  userRouter,
};
