require("dotenv").config()
const {checkJwt} = require('./utils/checkjwt')
const argon2  = require("argon2")
const express = require('express')
const jwt = require('jsonwebtoken')

const supersecret = process.env.SUPERSECRET


// const router = require('./routes/routes')


const app = express()

const connection = require('./SQL/connection')

app.use(express.json())
// app.use(router)

const port = process.env.PORT||8005

app.get('/HELLO', (req, res)=>{
  res.json('Hello World')
})

app.get('/users', checkJwt, (req,res)=>{
  console.log('Inside get /users')
  let sql = 'SELECT * FROM users'
  connection.query(sql, function(err, rows){
      if (err){
        console.log(err.sqlMessage)
        res.status(500).send('Did not get rows')
      }
      res.json(rows)
  })
})

app.post('/users', async (req, res)=>{
  console.log('Inside users route', req.body);
  const {user_name, user_password} = req.body
  console.log(user_name);
  let sql = 'INSERT INTO users (user_name, user_password) VALUES (?, ?)'
  let hash= await argon2.hash(user_password)
  connection.query(sql, [user_name, hash], (err, results)=>{
    if (err){
      console.log(err.sqlMessage)
      res.status(500).send('Did not get correct body info')
    } 
    console.log(results);
    res.json(`Inserted user at ${results.insertId}`)
  })
})

app.post('/login', async (req, res) =>{
  console.log('Inside login route');
  const name = req.body.user_name
  const password = req.body.user_password
  let sql = 'SELECT * FROM users WHERE user_name = ?'
  connection.query(sql, [name], async (err, results)=>{
    if(err){
      console.log(err.sqlMessage)
      return res.status(500).send('Did not get correct info')
    } if (results.length== 0){
      return res.status(400).json('user name is not found')
    } if (results.length == 1){
      const hash = results[0].user_password
      let good_password = await argon2.verify(hash, password)
      if (good_password) {
          const unsigned_token = {
            user_name : results.user_name,
            user_id : results.user_id
          }
          const token = jwt.sign(unsigned_token, supersecret)


        return res.json(token)
      } else {
        return res.json('password is not correct')
      }
    }
    res.json(results)
  })
})



app.listen(port, function(){
  console.log('listening on PORT ', port);
})
