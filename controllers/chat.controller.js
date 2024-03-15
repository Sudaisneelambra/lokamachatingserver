const chats = require('../models/chats')
const jwt = require('jsonwebtoken');

module.exports={
    postchat: async (data,sender,reviver)=>{
        const save = new chats({
            reciever:reviver,
            sender:sender,
            chatdata:data
        })
        const saved= await save.save()
    },
    verifytocken:(token)=>{
        const secretKey= process.env.SECRET_KEY;
        jwt.verify(token, secretKey, (err, decoded) => {
          if (err) {
            console.log({message: `verification fialed due to  ${err.message}`, expiry: err.message})
          } else {
            const expirationTime = decoded.exp;
            const currentTime = Math.floor(Date.now() / 1000);
      
            if (expirationTime < currentTime) {
              console.log('Authorization header has expired');
            } else {
              console.log(decoded);
              return decoded
            }
          }
        });
      }
}