const dotenv =  require('dotenv');
const mongoose =  require('mongoose');
const DB = process.env.DATABASE;
mongoose.connect(DB,{
    useUnifiedTopology: true,
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false
}).then(()=>{
    
    console.log('connection successfull with mondodbatlas')
}).catch((err)=>{
   console.log(`something went wrong with mongo atlas connection! and the error is${err}`);
})