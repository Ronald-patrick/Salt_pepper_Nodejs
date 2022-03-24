const express = require('express')
const User = require('./models/user.model')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

app.use(cors())
app.use(express.json())

mongoose.connect('mongodb://localhost:27017/bug_tracker')

app.post('/api/register',async (req,res)=>{
	const hash_password = await bcrypt.hash(req.body.password,10)
	try{
		const user = await User.create({
			name: req.body.name,
			email: req.body.email,
			password: hash_password
		})
		res.json({status: 'ok'})
	}
	catch(err){
		res.json({status: 'error',error : 'Duplicate email'})
	}

})

app.post('/api/login',async (req,res)=>{
	try{
		const user = await User.findOne({
			email: req.body.email,
		})

		if(!user)
		{
			return {status:'error',error : 'Invalid login'}
		}

		const isValid = await bcrypt.compare(req.body.password,user.password)
		
		if(isValid)
		{
			const token = jwt.sign({
				name:user.name,
				email:user.email
			},
			'secret123')

			res.json({status:'ok',user:token})
		}

		else
		res.json({status:'error',user:false})
	}
	catch(err){
		res.json({status: 'error',error : err})
	}

})

app.get('/api/checkjwt',async (req,res)=>{
	const token = req.headers['x-access-token']

	try{
		const decoded = jwt.verify(token,'secret123')
		const email = decoded.email
		res.json({status: 'ok',email : email})
	}
	catch(err){
		console.log(err);
		res.json({status: 'error',error : 'invalid token'})
	}

})

app.listen(5000,()=>{
	console.log("Server Started at port :",5000);
})