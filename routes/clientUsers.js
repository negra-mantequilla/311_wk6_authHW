const express = require('express')
const router = express.Router()
const {checkJwt} = require('../utils/checkjwt')
const clientUsersController = require('../controllers/clientUsers')

router.get("/client-user-relation",checkJwt,clientUsersController.getClientUserRelation)

module.exports = router