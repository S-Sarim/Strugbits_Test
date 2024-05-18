const express = require('express');
const router = express.Router();
const User = require('../model/User');
const Records = require('../model/record');
const recordController = require('../controllers/recordController');
const userController = require('../controllers/userController');


router.get("/listrecord", async(req, res) => {
	const user = await User.findOne({ username: req.session.user.username });
	if(!user){
		userController.signout(req,res);
	}
	else{
		recordController.getRecords(req, res);
	}
});

router.get("/addrecord", async (req, res) => {
    const user = await User.findOne({ username: req.session.user.username });
	if(!user){
		userController.signout(req,res);
	}
	else{
		res.render("Record/AddRecord", {Title: "Add A New Record"});
	}
	
})

router.post("/addrecord", (req, res)=>{
    recordController.addRecord(req,res);
});

router.post("/deleterecord", async(req, res)=>{
	const user = await User.findOne({ username: req.session.user.username });
	if(!user){
		userController.signout(req,res);
	}
	else{
		recordController.deleteRecord(req,res);	
	}
    
});


router.get("/updaterecord",async (req,res)=>{
    const user = await User.findOne({ username: req.session.user.username });
	if(!user){
		userController.signout(req,res);
	}
	else{
		const RecordToUpdate = req.query.username;
		const Record = await Records.findOne({ username: RecordToUpdate });
		res.render('Record/UpdateRecord', { Record });
	}
	
});

router.post("/updaterecord", (req, res) => {
    recordController.editRecord(req,res);
});



module.exports = router;
