const mongoose = require('mongoose');
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose');
const records = new Schema({
	username: {
		type: String,
		require: true
	},
	fullname: {
		type: String,
		require: true
	}

});
records.plugin(passportLocalMongoose);

module.exports = mongoose.model('Record', records);
