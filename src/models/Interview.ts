import * as mongoose from 'mongoose';

const mongooseSchema = new mongoose.Schema({
     jobs_id:{
         type:String,
         required:true
     },
     user_id:{
         type:String,
         required:true
     },
     date:{
         type:String,
         required:true
     },
     time:{
         type:String,
         required:true
     },
     accept:{
         type:String
     }
})

const interview = mongoose.model('interview',mongooseSchema);

export default interview;