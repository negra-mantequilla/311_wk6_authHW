const express = require('express')
const router = express.Router()
const {checkJwt} = require('../utils/checkjwt')
const userController = require('../controllers/users')
router.get('/users', checkJwt, userController.getUsers)


router.post('/users', userController.createUser)

router.post('/login', userController.login)



module.exports= router