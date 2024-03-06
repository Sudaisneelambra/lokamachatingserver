const chats = require('../models/chats')
module.exports={
    postchat: async (data,sender,reviver)=>{
        const save = new chats({
            reciever:reviver,
            sender:sender,
            chatdata:data
        })

        const saved= await save.save()
    },
    usermessages:async (req, res) => {
        console.log(req.tokens);
        console.log('manyu');
        try {
            const messages = await chats.find( {
              $or: [
                { sender: req.tokens.username },
                { reciever: req.tokens.username }
            ]
            })
            res.json(messages);
        } catch (error) {
            console.error('Error fetching messages:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    allusermessages:async (req, res) => {
        console.log(req.tokens);
        console.log('manyu');
        try {
            const messages = await chats.find({})
            res.json(messages);
        } catch (error) {
            console.error('Error fetching messages:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    getsingleusrchat:async (req, res) => {
        try {
            const username= req.params.name
            const messages = await chats.find({
                $or: [
                    { sender:username },
                    { reciever:username }
                ]
            })
            console.log(messages);
            res.json(messages);
        } catch (error) {
            console.error('Error fetching messages:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
}