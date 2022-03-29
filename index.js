const express = require('express')
const User = require('./models/user.model')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')

const bcrypt = require('bcryptjs')
var crypto = require('crypto');

function caesarCipher (str, key) {
	return str.toUpperCase().replace(/[A-Z]/g, c => String.fromCharCode((c.charCodeAt(0)-65 + key ) % 26 + 65));
}

const pepper = "KZ6@85"

app.use(cors())
app.use(express.json())

mongoose.connect('mongodb://localhost:27017/salt_pepper')

app.post('/api/register',async (req,res)=>{
	
	salt = caesarCipher(req.body.password,4); // Caeser Cipher

	password_salt_pepper = salt + req.body.password + pepper;
	var md5hash = crypto.createHash('md5').update(password_salt_pepper).digest('hex');

	try{
		const user = await User.create({
			username: req.body.username,
			password: md5hash,
			salt : salt
		})
		res.json({status: 'Created', data : user})
	}
	catch(err){
		res.json({status: 'error',error : err})
	}

})

app.post('/api/login',async (req,res)=>{
	try{
		const users = await User.find()

		for(var i in users)
		{	
			if(users[i].username === req.body.username)
			{
				salt = caesarCipher(req.body.password,4) // Caeser Cipher
				password_salt_pepper = salt + req.body.password + pepper;
				var md5hash = crypto.createHash('md5').update(password_salt_pepper).digest('hex');
				console.log(md5hash);
				if(md5hash === users[i].password)
				{
					res.json({status: 'Logged in'})
					return;
				}
			}
		}
		res.json({status: 'Invalid Auth'})

	}
	catch(err){
		res.json({status: 'error',error : err})
	}

})


app.listen(5000,()=>{
	console.log("Server Started at port :",5000);
})