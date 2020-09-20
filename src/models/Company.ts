import * as  mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    },
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    nationality:{
        type:String,
        required:true
    },
    companyName:{
        type:String,
        required:true
    },
    websiteUrl:{
        type:String,
        required:true
    },
    industryType:{
        type:String,
        required:true
    },
    numberOfEmployee:{
        type:String,
        required:true
    },
    contactPerson:{
        type:String,
        required:true
    },
    emailNotification:{
        type:String,
        required:true
    },
    companyPhone:{
        type:String,
        required:true
    },
    companyAddress:{
        type:String,
        required:true
    },
    verificationToken:{
        type:Number
    },
    reset_password_token:{
        type:Number
    },



})

const company = mongoose.model('company',companySchema);

export default company;