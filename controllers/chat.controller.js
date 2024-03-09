const chats = require('../models/chats')
module.exports={
    postchat: async (data,sender,reviver)=>{
        const save = new chats({
            reciever:reviver,
            sender:sender,
            chatdata:data
        })
        const saved= await save.save()

        console.log(saved);
    },
}