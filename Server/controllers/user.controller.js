const userModel = require('../models/users.model');
const blacklistModel = require('../models/blacklist.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports.signup= async (req,res,next) =>{
  try{
    const { email, password, username, role} =req.body;
    if(!email || !password || !username){
      return res.status(400).json({message:'All fields are required'});
    }

    const isUserAlreadyExist = await userModel.findOne({ email });
    if(isUserAlreadyExist){
      return res.status(400).json({message:'User already exist'});
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({ 
      email, 
      password: hashedPassword, 
      username, 
      role 
    });

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ 
      token, 
      user, 
      message: 'User created successfully' 
    });

  }catch(err){
      next(err);
  }
};

module.exports.signin= async (req,res,next) =>{
  try{
    const {email, password}=req.body;
    if(!email || !password){
      return res.status(400).json({message:'All fields are required'});
    }
    
    const user = await userModel.findOne({ email });
    if(!user){
      return res.status(400).json({message:'Invalid credentials'});
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid){
      return res.status(400).json({message:'Invalid credentials'});
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({ 
      token, 
      user, 
      message: 'User logged in successfully' 
    });

  }catch(err){
    next(err);
  }
}

module.exports.logout= async (req,res,next) =>{
  try{
    const { authorization } = req.headers;
    if(!authorization){
      return res.status(401).json({ message:'Unauthorized' });
    }

    const token = authorization.split(' ')[1];
    if(!token){
      return res.status(401).json({ message:'token is required' });
    }

    const isTokenBlackList = await blacklistModel.findOne({ token });
    if(isTokenBlackList){
      return res.status(400).json({ message:'Token is already blacklisted' });
    }

    await blacklistModel.create({ token });

    res.status(200).json({ message:'User logged out successfully' });
  }catch(err){
    next(err);
  }
}

module.exports.getProfile= async(req,res,next)=>{
  try{
    const user=await userModel.findById(req.user._id);
    res.status(200).json({
      message:"User fetched Successfully",
      user
    });
  }catch(err){
    next(err);
  }
}

