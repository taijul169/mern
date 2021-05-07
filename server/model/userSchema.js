const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userSchema = new mongoose.Schema({
    name :{
        type:String,
        required:true
    },
    email :{
        type:String,
        required:true
    },
    phone :{
        type:Number,
        required:true
    },
    work :{
        type:String,
        required:true
    },
    password :{
        type:String,
        required:true
    },
    cpassword :{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    },
    message:
    [
      {
            name :{
                type:String,
                
            },
            email :{
                type:String,
                
            },
            phone :{
                type:Number,
            
            },
            message:{
                type:String
            }
      }
],
    tokens:[
        {
            token:{
                type:String,
            }
        }
    ]
})

// Hashing password-----------------------
userSchema.pre('save', async function(next){
    console.log('i am inside pre midleware....');
  if(this.isModified('password')){
      this.password = await bcrypt.hash(this.password, 12);
      this.cpassword = await bcrypt.hash(this.cpassword, 12);
  }
  next();
});


// generate jsonwebtoken
userSchema.methods.generateAuthtoken = async function (){
    try {
        const token = jwt.sign({_id:this._id}, process.env.SICRET_KEY);
         this.tokens =  this.tokens.concat({token:token});
        await this.save();
        return token;
        
    } catch (error) {
        console.log(error)
    }
}

// store the message
userSchema.methods.addMessage = async function (name,email,phone,message){

    try {
        this.message = this.message.concat({
            name,
            email,
            phone,
            message
        });
        await this.save();
        return message;
    } catch (error) {
        console.log(error)
    } 
}
const User = mongoose.model('USER',userSchema);
module.exports = User;