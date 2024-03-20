require('dotenv').config()
const cors = require('cors');
const mongoose = require('mongoose');
const port = process.env.PORT;
const DB_url =process.env.DB_connection


const app = require('express')();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer, {
    cors: {origin : '*'}
  });

app.use(cors());

 const {postchat}=require('./controllers/chat.controller');


 let array=[]

 io.use(async (socket, next) => {
  socket.username=socket.handshake.auth.username
  next()
 }).on('connection', (socket) => {
    console.log('a user connected');
    const one={
      username:socket.username,
      socketid:socket.id
    }

    array.push(one)


    socket.on('message', (data) => {
     const {chatdata, sender,reciever} =  data
      postchat(chatdata, sender,reciever)
      data.date = new Date()
      data.reciever = reciever
      data.chatdata = chatdata
      const recevingperson= array.filter((e)=>{
        return e.username == reciever
      })
      if(recevingperson.length>0){
        recevingperson.forEach((m)=>{
          io.to(m.socketid).emit('message', data);  
        })
      }
    });
  
    socket.on('disconnect', () => {
      console.log('a user disconnected!');
      const dlt= array.findIndex((m)=> m.socketid===socket.id)
      if (dlt !== -1) {
        array.splice(dlt, 1);
        console.log(array);
    } else {
        console.log('Element not found in array');
    }
    });
  });

// MongoDB connection
mongoose.connect(DB_url)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

  httpServer.listen(port, () => console.log(`listening on port ${port}`));