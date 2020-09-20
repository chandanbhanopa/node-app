import * as mongoose from 'mongoose';

const applyjobsSchame = new mongoose.Schema({
    jobs_id:{
        type:String,
        required:true,
    },
    user_id:{
        type:String,
        required:true
    }
})

const applyjobs = mongoose.model('applyjobs',applyjobsSchame);
export default applyjobs;