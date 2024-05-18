const express = require('express');
const router = express.Router();
const User = require('../model/User');
const userController = require('../controllers/userController');



router.get("/updateuser", async (req, res) => {
    const users = await User.findOne({ username: req.session.user.username });
	if(!users){
        res.render("secret", { Title: "You are not Logged in!" });
	}
    else{
        const userToUpdate = req.query.username;
        const user = await User.findOne({ username: userToUpdate });
        res.render('User/updateuser');
    }
});

router.post("/updateuser", (req, res) => {
    userController.editUser(req, res);
});

router.get("/adduser", async (req, res) => {
    const user = await User.findOne({ username: req.session.user.username });
	if(!user){
	    res.render("secret", { Title: "You are not logged in!" });
	}
    else{
        res.render("User/adduser");
    }
})

router.post("/adduser", (req, res) => {
    userController.addUser(req, res);
});

router.get("/userslist",async (req, res)=> {
    const user = await User.findOne({ username: req.session.user.username });
	if(!user){
        res.render("secret", { Title: "You are not logged in!" });
	}
    else{
        userController.getUser(req,res);
    }	
});

router.get("/signout" ,(req, res) => {
   userController.signout(req,res);
});


module.exports = router;
