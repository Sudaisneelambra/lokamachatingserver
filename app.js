require('dotenv').config()
const cors = require('cors');
const mongoose = require('mongoose');
const chat = require('./models/chats');

const tokens= require('./middlewares/tokenteck')


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
  const {usermessages}=require('./controllers/chat.controller');
  const {allusermessages}=require('./controllers/chat.controller');
  const {getsingleusrchat}=require('./controllers/chat.controller');




  io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('message', (data) => {
     const {message, sender,reviver} =  data  
      postchat(message, sender,reviver)
      io.emit('message', `${sender}: ${message}`);
    });
  
    socket.on('disconnect', () => {
      console.log('a user disconnected!');
    });
  });

// MongoDB connection
mongoose.connect(DB_url)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));



  app.get('/usermessages',tokens, usermessages);
  app.get('/allmessages',tokens, allusermessages);
  app.get('/getsingleusrchat/:name',tokens, getsingleusrchat);



  httpServer.listen(port, () => console.log(`listening on port ${port}`));