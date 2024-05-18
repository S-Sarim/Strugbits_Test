const express = require('express');
const router = express.Router();
const User = require('../model/User');
const Role = require('../model/role');
const Records = require('../model/record');
const Messages = require('../model/messages');
const messageController = require('../controllers/messageController');
const recordController = require('../controllers/recordController');


router.get("/listmessages", async(req, res) => {
	const user = await User.findOne({ username: req.session.user.username });
	if(!user){
		userController.signout(req,res);
	}
	else{
        messageController.getMessages(req,res);
	}
});

router.get("/sendmessage", async (req, res) => {
    const user = await User.findOne({ username: req.session.user.username });
	if(!user){
		userController.signout(req,res);
	}
	else{
		res.render("Messages/SendMessage", {Title: "Send A New Record"});
	}
	
})

router.post("/sendmessage", (req, res)=>{
    messageController.sendMessage(req,res);
});

router.post("/deletemessage", async(req, res)=>{
	const user = await User.findOne({ username: req.session.user.username });
	if(!user){
		userController.signout(req,res);
	}
	else{
		messageController.deleteForAllMessages(req,res);	
	}
    
});

module.exports = router;
