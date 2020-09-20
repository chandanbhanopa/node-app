import * as mongoose from 'mongoose';

const counterSchame = new mongoose.Schema({
       name:{
           type:String,
           required:true
       },
       code:{
           type:String,
           required:true
       }
})

const counter = mongoose.model('counter',counterSchame);
export default counter;