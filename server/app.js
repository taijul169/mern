const dotenv =  require('dotenv');
const express = require('express');
var cookieParser = require('cookie-parser'); 
const app = express();
const User = require('./model/userSchema')
dotenv.config({path:'./config.env'});

require('./db/conn');

app.use(express.json());
app.use(cookieParser())
// we link the router  file to make our route easy
app.use(require('./router/auth'))
const PORT = process.env.PORT
app.listen(5000,()=>{
   console.log(`app is running at port no:${PORT}`);
})