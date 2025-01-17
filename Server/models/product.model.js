const mongoose=require('mongoose');

const ProductSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    image:[ {
        type:String,
    } ],
    seller:{
        type:mongoose.Schema.Types.ObjectID,
        ref:'user',
        required:true
    },
},{ timestamp:true });

module.exports = mongoose.model('user',ProductSchema);
