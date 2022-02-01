const express = require('express')
const router = express.Router()
const {checkJwt} = require('../utils/checkjwt')
const clientsController = require('../controllers/clients')


// Get a list of the clients
router.get('/clients', clientsController.getClients)
// Get a client by id

router.get('/client/:id', clientsController.getClientById)

// add client (make sure to use POST)

router.post('/createClient', clientsController.createNewClient)


// edit client BIO (make sure to use PUT)

router.put('/clientCode/:id', checkJwt,clientsController.assignMentorByClientCode)



// Delete client


router.delete('/client/:clientId', checkJwt, clientsController.clientDelete)


// Assign client to user (mentor)







module.exports=router