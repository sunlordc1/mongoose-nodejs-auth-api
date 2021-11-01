const express =  require('express')
const router = express.Router();
const User = require('../models/User')
const md5 = require('md5')
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/auth');

//@route GET api/auth/
//@desc Check if user is login in
//@access Public
router.get('/', verifyToken,async(req,res)=>{
    try {
        const user = await User.findById(req.uid).select('-password')
        if(!user) return res.status(400).json({success:false,message:'User not found'})
        res.json({success:true,user})
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false,message:'Internal server error'})
    }
})

//@route POST api/auth/register
//@desc Register user
//@access Public
router.post('/register',async(req,res)=>{
    const {username,password} = req.body
    //Simple validation
    if(!username || !password)
    return res.status(400).json({success:false,message:'Missing username and/or password'})
    try{
        //Check for existing user
        const user = await User.findOne({username})
        if(user) return res.json({success:false,message:'Username already'})
  
        const hashPassword = md5(password);
        
        const newUser = new User({
            username,
            password:hashPassword,
            createdAt:Date.now(),
            updatedAt:Date.now(),
        })

        await newUser.save()

        //return Access Token
        const accessToken = jwt.sign({userId:newUser._id},process.env.ACCESS_TOKEN_SECRET)
        res.json({success:true,message:'User created successfully',accessToken})
        }catch(error){
            console.log(error.message)
            res.status(500).json({success:false,message:'Internal server error'})
        }
})
//@route POST api/auth/login
//@desc Login user
//@access Public
router.post('/login',async(req,res)=>{
    const {username,password} = req.body;
    if(!username || !password) return res.status(400).json({success:false,message:'Incorrect username and/or password'})
    try {
        // Check for existing user
        const hashPassword = md5(password);
        const user = await User.findOne({username,password:hashPassword})
        if(!user) return res.json({success:false,message:'Incorrect username and/or password'})
        // All good validation then return Access Token
        const accessToken = jwt.sign({uid:user._id},process.env.ACCESS_TOKEN_SECRET)
        res.json({success:true,message:'Login Success',accessToken})      
    } catch (error) {
        
    }
})


module.exports  = router