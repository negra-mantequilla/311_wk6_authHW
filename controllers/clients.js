const connection = require('../SQL/connection')


function getClients(req,res){
  console.log('Inside get /clients')
  let sql = 'SELECT * FROM clients'
  connection.query(sql, function(err, rows){
      if (err){
        console.log(err)
        res.status(500).send('Did not get rows')
      }
      res.json(rows)
  })
}



function getClientById(req,res){
  console.log('Inside get /client/:id');
  const clientID = req.params.id
  // res.json(clientID)
  let sql = 'SELECT * FROM clients WHERE clients_id = ?'
  connection.query(sql, [clientID], function(err, rows){
    if (err) {
      console.log(err.sqlMessage)
      res.status(500).send('Did not get rows')
    } if (rows.length == 0){
      res.status(404).send('row doesnt exist')
    } 
    else {
      res.json(rows)
    }
  })
}



function createNewClient(req,res){
  console.log('inside createNewClient route');
  const {full_name, bio} = req.body
  const body = [full_name, bio]
  let sql = 'INSERT INTO clients (full_name, bio) VALUES (?,?)'
  connection.query(sql, body, function(err,results){
    if (err) {
      console.log(err.sqlMessage);
      res.status(500).send('Did not get rows')
    } else {
      console.log(results);
      res.json(`Inserted user at ${results.insertId}`)
    }
  })
}

function assignMentorByClientCode(req,res){
  console.log('inside assignMentorByClientID route');
  let user_id = req.user_id
  let clients_id = req.params.clientId
  let sql = 'UPDATE clients SET user_id = ? WHERE clients_id = ?'
  let body = [user_id, clients_id]
  connection.query(sql, body, function (err, results){
    if(err) {
      console.log(err.sqlMessage);
      res.status(500).send('Did not get rows')
    } else {
      console.log(results);
      res.json(results)
    }
  }) 
}



function clientDelete (req, res) {
  const id = req.params.clientId
  console.log(id);
  let sql = 'DELETE FROM clients WHERE clients_id = ?'
  connection.query(sql, [id], function(err, results){
    if (err){
      console.log(err.sqlMessage)
      res.status(500).send(err.sqlMessage)
    } if(results.affectedRows == 0) {
      return res.status(501).send('ID does not exist')
    }
  res.json(`Deleted Item at ${id}`)
  })
}



module.exports={getClients, getClientById, createNewClient, assignMentorByClientCode, clientDelete}