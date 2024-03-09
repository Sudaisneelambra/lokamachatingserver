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

  // requiring cors

// using cors
app.use(cors());

 const {postchat}=require('./controllers/chat.controller');


  io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('message', (data) => {
     const {message, sender,reviver} =  data  
      postchat(message, sender,reviver)
      data.date = new Date()
      data.reciever = reviver
      data.chatdata = message
      io.emit('message', data);
    });
  
    socket.on('disconnect', () => {
      console.log('a user disconnected!');
    });
  });

// MongoDB connection
mongoose.connect(DB_url)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

  httpServer.listen(port, () => console.log(`listening on port ${port}`));