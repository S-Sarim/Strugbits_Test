const mongoose = require('mongoose');
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose');
const messages = new Schema({
    _id: {
		type: String,
		require: true
	},
	sender: {
		type: String,
		require: true
	},
    message: {
		type: String,
		require: true
	},
	recipient: {
		type: String,
		require: true
	}

});
messages.plugin(passportLocalMongoose);

module.exports = mongoose.model('Messages', messages);
