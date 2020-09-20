import * as mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {type:String,required:true},
    firstName: {type:String,required:true},
    lastName: {type:String,required:true},
    phone: {type:String,required:true},
    password:{type:String},
    dob:{type:Date},
    gender:{type:String},
    location:{type:String},
    nationality: {type:String},
    qualification:{type:String},
    currentJob: {type:String},
    yearOfExp: {type:String},
    availability:{type:String},
    cvUploaded:{type:String},
    verificationToken:{type:Number},
    reset_password_token:{type:Number},
    create_at: {type: Date, required:true,default: new Date()}
    

})

const user = mongoose.model('user',userSchema);
export default user;