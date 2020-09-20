import * as mongoose from 'mongoose';
import user from '../models/User';


const JobsSchema = new mongoose.Schema({
    user_id:{
      type:mongoose.Types.ObjectId,
      Requerd:true
    },
    jobsType:{
        type:String,
        required:true
    },
    skills:{
        type:String,
        required:true
    },
    exprence:{
        type:String,
        required:true
    },
    package:{
        type:String,
        required:true
    },
    education:{
        type:String,
        required:true

    },
    JobSummary:{
        type:String,
        required:true
    },
    ResponsibilitiesDuties:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true,

    },
    industries:{
        type:String,
        required:true
    }
    
})

const jobs = mongoose.model('jobs',JobsSchema);
export default jobs;