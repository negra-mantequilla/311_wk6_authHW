const express = require('express')
const router = express.Router()
const {checkJwt} = require('../utils/checkjwt')
const clientUsersController = require('../controllers/clientUsers')

router.get("/client-user-relation-by-user",checkJwt,clientUsersController.getClientUserRelationById)
router.get("/client-user-relation",clientUsersController.getClientUserRelation)

module.exports = router