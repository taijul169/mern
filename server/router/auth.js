const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticate = require('../middleware/authenticate');
const router = express.Router();
require('../db/conn');
const User = require('../model/userSchema');



router.get('/',(req, res)=>{
    res.send("this is home page");
})

router.get('/about',authenticate, (req,res)=>{
    res.send(req.rootUser)
});
//logout page
router.get('/logout', (req,res)=>{
    res.clearCookie('jwtoken',{path:'/'})
    res.status(200).send("User Logged Out")
});
// get user data for hompage and contact page
router.get('/getdata',authenticate, (req,res)=>{
    res.send(req.rootUser)
})

// signup-route=====================
router.post('/register',(req, res)=>{
   const {name, email, phone, work, password, cpassword } = req.body;
   if(!name || !email || !phone || !work || !password || !cpassword){
       res.status(422).json({error:'all the filed must be filled with data.!!'})
   }
   User.findOne({email:email}).then((userExist)=>{
       if(userExist){
           return res.status(422).json({error:'Email already exist'});
       }
       const user = new User({name,email,phone,work,password, cpassword});
       user.save().then(()=>{
           res.status(201).json({message:'User Registered successfully'})
       }).catch(()=>{
           res.status(500).json({error:'Registration Failed!!'});
       })
   })
})


// signin-route=====================
router.post('/signin', async(req, res)=>{

    try {
        let token;
        const {email,  password } = req.body;
        if( !email || !password){
            res.status(422).json({error:'all the filed must be filled with data.!!'});
        }
        const existEmail = await User.findOne({email:email});
        if(existEmail){
            const passMatch = await bcrypt.compare(password, existEmail.password);
             token = await existEmail.generateAuthtoken();
            res.cookie("jwtoken",token,{
                expires:new Date(Date.now()+259000000),
                httpOnly:true
            });
            console.log('cookie created successfully.');

            if(passMatch){
                res.status(200).json({Message:'Your are Logged in'});
                
                
            
            }
            else{
                res.status(400).json({error:'Wrong password!!'})
            }
        }
        else{
            res.status(400).json({error:"Email Dosen't exist"});
        }
        
    } catch (error) {
        res.status(500).json(error);
    }
   
 });
// sending data to server in contct page
// get user data for hompage and contact page
router.post('/contact',authenticate, async(req,res)=>{
    try {
        const {name, email,phone,message} = req.body;
        if(!name || !email || !phone || !message){
            return res.json({error:"pLz fillup the field!!"});
        }
        const userContact = await User.findOne({_id:req.userID});
        if(userContact){
            const userMessage = await userContact.addMessage(name,email,phone,message)
            await userContact.save();
            res.status(201).json({message:"Message sent successfully."})
        }
    } catch (error) {
        console.log(error);
    }
})

module.exports =  router;