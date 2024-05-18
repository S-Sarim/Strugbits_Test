const User = require('../model/User');
const Record = require('../model/record');
const mongoose = require('mongoose');



async function addRecord(request, response){
    let session;
	try{
		session = mongoose.startSession();
		await session.startTransaction();
		const newRecord = new Record();
		newRecord.username = request.body.username;
		newRecord.fullname = request.body.fullname;
		await newRecord.save({session});
		await session.commitTransaction();
		response.redirect("/records/listrecord");
	}
	catch (error) {
		await session.abortTransaction();
    	response.render("Record/AddModule");
    }
	finally{
		session.endSession();
	}
};


async function getRecords(request, response){
	const user = await User.findOne({ username: request.session.user.username });
	const newRecords = await Record.find({}, 'username fullname');
	response.render("Record/ListRecord", {newRecords}); 
};


async function deleteRecord(request, response){
	const RecordToDelete = request.body.username;
	await Record.findOneAndDelete({ username: RecordToDelete });
	response.redirect('/records/listrecord');
};


async function editRecord(request, response){
	try {
		const session = mongoose.startSession();
		await session.startTransaction();
		const Records = await Record.findOne({username: request.body.username});
		const filter = { username: request.body.username };
		const update = { $set: {} };
		if(request.body.fullname.trim() == ''){
			var fullname = Records.fullname;
		}else{
			var fullname = request.body.fullname;
		}
		update.$set.fullname = fullname;
		const result = await Record.updateOne(filter, update,session);
		if (!result) {
		  response.render("Record/UpdateModule");
		} else {
		  await session.commitTransaction();
		  response.redirect('/records/listrecord');
		}
	  } catch (error) {
		await session.abortTransaction();
		return response.status(500).json({ error: 'Internal server error.' });
	  }
	  finally{
		session.endSession();
	  }
};

module.exports = {
	addRecord,
	editRecord,
	deleteRecord,
	getRecords,
  };