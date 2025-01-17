require('dotenv').config();
const express=require('express');
const app=express();
const indexRoutes =require('./routes/index.routes');
const userRoutes = require('./routes/user.routes');
const connectDB = require('./config/mongodb');
connectDB();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/',indexRoutes);
app.use('/user',userRoutes);

app.listen(process.env.PORT||3000,()=>{
  console.log("server run on http://localhost:3000");
});

