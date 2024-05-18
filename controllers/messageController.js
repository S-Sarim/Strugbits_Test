const User = require('../model/User');
const Record = require('../model/record');
const Messages = require('../model/messages');
const mongoose = require('mongoose');



async function sendMessage(request, response){
    let session;
	try{
        const recipient = await User.findOne({username: request.body.recipient});
        const sender = await User.findOne({username: request.session.user.username});
		session = mongoose.startSession();
		await session.startTransaction();
		const newMessage = new Messages();
		newMessage.sender = sender;
		newMessage.message = request.body.message;
        newMessage.recipient = recipient;
		await newMessage.save({session});
		await session.commitTransaction();
		response.redirect("/messages/listmessages");
	}
	catch (error) {
		await session.abortTransaction();
    	response.render("Messages/SendMessage");
    }
	finally{
		session.endSession();
	}
};


async function getMessages(request, response){
	const user = await User.findOne({ username: request.session.user.username });
    const messages = await Messages.find({
        $or: [
            { sender: user },
            { receiver: user }
        ]
    })
	response.render("Messages/ListMessage", {messages}); 
};


async function deleteForAllMessages(request, response){
	const messageToDelete = request.body.message._id;
	await Messages.findByIdAndDelete(messageToDelete);
	response.redirect('/messages/listmessages');
};



module.exports = {
	sendMessage,
	getMessages,
	deleteForAllMessages,
};