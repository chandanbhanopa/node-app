import * as  mongoose from 'mongoose';

const trainingSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
   



})

const Training = mongoose.model('training',trainingSchema);

export default Training;