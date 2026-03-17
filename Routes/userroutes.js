const express = require('express')
const Router = express.Router();
const Usercontroller = require('../Controllers/usercontroller')
const authToken = require('../Middleware/authmiddleware')

Router.post('/signup', Usercontroller.signup)
Router.get('/users', authToken, Usercontroller.getuser)
Router.post('/login', Usercontroller.login)
Router.delete('/user/:id', authToken, Usercontroller.deleteuser)
Router.get('/user/:id', authToken, Usercontroller.getuserid)
Router.post('/token',Usercontroller.getToken)
Router.delete('/logout', Usercontroller.logout)

module.exports= Router;
