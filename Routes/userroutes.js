const express = require('express')
const Router = express.Router();
const Usercontroller = require('../Controllers/usercontroller')
const authToken = require('../Middleware/authmiddleware')

Router.post('/users', Usercontroller.createuser)
Router.get('/users', authToken, Usercontroller.getuser)
Router.post('/login', Usercontroller.login)
Router.post('/user/login', Usercontroller.userlogin)
Router.delete('/user/:id', authToken, Usercontroller.deleteuser)
Router.get('/user/:id', authToken, Usercontroller.getuserid)
Router.post('/token',Usercontroller.getToken)
Router.delete('/logout', Usercontroller.logout)

module.exports= Router;
