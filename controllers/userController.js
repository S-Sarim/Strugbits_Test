const User = require('../model/User');
const crypto = require('crypto');
const mongoose = require('mongoose');

	async function addUser(request, response){
		try{
			const session = mongoose.startSession();
			session.startTransaction();
			const users = await User.findOne({username:request.body.username},session);
			const email = await User.findOne({email: request.body.email},session);
			if(!isValidEmail(request.body.email)){
				throw new Error("Please enter an email in proper format!");
			}
			if(users){
				throw new Error("Username already exists");
			}
			if(email){
				throw new Error("Email already in use");
			}
			if(request.body.username.trim() === ''){
				throw new Error("Username can not be blank");	
			}
			var salt = crypto.randomBytes(16).toString('hex');
			let newusers = new User();
			newusers.username = request.body.username;
			newusers.salt = salt;
			newusers.fullname = request.body.fullname;
			newusers.email = request.body.email;
			newusers.password = crypto.pbkdf2Sync(request.body.password, salt, 500, 32, 'sha512').toString('hex');
			await newusers.save({session});
			await session.commitTransaction;
			return response.redirect("/users/userslist");
		}
		catch (error){
			await session.abortTransaction();
			response.render("User/adduser");
		}
		finally{
			session.endSession();
		}
	};

	async function registerUser(request, response){
		try{
			const session = mongoose.startSession();
			await session.startTransaction;
			const user = await User.findOne({username:request.body.username},session);
			const email = await User.findOne({email: request.body.email},session);
			if(!isValidEmail(request.body.email)){
				throw new Error("Please enter an email in proper format!");
			}
			if(user){
				throw new Error("Username already exists!");
			}
			if(email){
				throw new Error("Email already inuse!");
			}
			if(request.body.username.trim() === ''){
				throw new Error("can not be blank");	
			}
			var salt = crypto.randomBytes(16).toString('hex');
			let newuser = new User();
			newuser.username = request.body.username;
			newuser.salt = salt;
			newuser.fullname = request.body.fullname;
			newuser.email = request.body.email;
			newuser.password = crypto.pbkdf2Sync(request.body.password, salt, 500, 32, 'sha512').toString('hex');
			await newuser.save({session});
			request.session.user = {
				id : 1,
				username: request.body.username
			};
			await session.commitTransaction();
			response.redirect("/secret");
		}
		catch(error){
			session.abortTransaction();
			response.render("register");
		}
		finally{
			session.endSession();
		}
	};

	async function login(request, response){
		try{
			const user = await User.findOne({username:request.body.username}).select("+salt");
			const hashed = crypto.pbkdf2Sync(request.body.password, user.salt, 500, 32, 'sha512').toString('hex');
			const result = user.password === hashed;
			if(!user){
				throw new Error("Incorrect username");
			}
			if (!result) {
				throw new Error("Incorrect Password");
			}
			request.session.user = {
			id : 1,
			username: request.body.username
			};
			response.redirect("/secret");	
		}
		catch(error){
			response.render("login");
		}
		
	};

	async function editUser(request, response){
		const userToUpdate = request.body.username;
		const user = await User.findOne({ username: userToUpdate });
		try{
			const session = mongoose.startSession();
			await session.startTransaction();
			const username = request.body.username;
			const user1 = await User.findOne({ username: username });	
			var fullname = request.body.fullname;
			var email = request.body.email;
			const mailcheck = user1.email;
			if(!isValidEmail(request.body.email)){
				throw new Error("Please enter an email in proper format!");
			}
			if(email !== mailcheck ){
				const mail = await User.findOne({email: email});
				if(mail){
					throw new Error("Email already exists");
				}
			}
			if (!username && (!fullname || !email)) {
				throw new Error("Please enter email or fullname");
			}
			const filter = { username: request.body.username };
			const update = { $set: {} };
			update.$set.fullname = fullname;
			update.$set.email = email;
			const result = await User.updateOne(filter, update, session);
			if (!result) {
				throw new Error("User could not be updated");
			} else {
				await session.commitTransaction();
				response.redirect("/users/userslist");
			}
		}
		catch(error){
			session.abortTransaction();
			response.render("User/updateuser");
		}
		finally{
			session.endSession();
		}
	};

	async function getUser(request,response){
		try{
			const user = await User.findOne({ username: request.session.user.username });
			const users = await User.find({}, 'username fullname email');
			response.render("User/userlist", {users});
		}
		catch(error){
			console.log("error when fetching usernames"+error);
		}
	};

	function signout(request, response){
		request.session.destroy((err) => {
					if(err){
						return next(err);
					}
					else{
						request.logout(function(err1){
							if(err){
								return next(err1);
							}
							else{
								response.render("home");
							}
						});
					}
				});
	};
	function isValidEmail(email) {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	module.exports = {
		registerUser,
		deleteUser,
		editUser,
		addUser,
		login,
		getUser,
		signout,
	  };