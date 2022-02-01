const jwt = require('jsonwebtoken')
const supersecret = process.env.SUPERSECRET


function checkJwt (req,res, next){
  let token
  if(!req.headers.authorization) {
    token = null
    res.status(401).send('your not authorized')
  } else{
    console.log(req.headers.authorization);
    let bearer = req.headers.authorization.split(' ')
    console.log(bearer);
    token = bearer[1]
    jwt.verify(token, supersecret, (err, decoded)=>{
     if(err){
       res.status(401).send('your not authorized')
     } else {
       console.log(decoded);
       req.user_id=decoded.user_id
       next()
     }
    })
  }
}

module.exports = {checkJwt}