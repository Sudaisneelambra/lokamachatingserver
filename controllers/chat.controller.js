const chats = require('../models/chats')
const jwt = require('jsonwebtoken');

module.exports={
    postchat: async (data,sender,reciever)=>{
        const save = new chats({
            reciever:reciever,
            sender:sender,
            chatdata:data
        })
        const saved= await save.save()
    },
}