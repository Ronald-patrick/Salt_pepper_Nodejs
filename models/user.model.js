const mongoose = require('mongoose')

const User = new mongoose.Schema(
	{
	username: { type:String, required:true },
	password : { type:String, required:true },
	salt : {type:String,required:true}
	},
	{ collection: 'userdata'}
)

const model = mongoose.model('UserData',User)

module.exports = model