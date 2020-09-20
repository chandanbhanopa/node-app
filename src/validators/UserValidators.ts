import {body} from 'express-validator';
import User from '../models/User';
import { Utils } from '../utils/Utils';
import Jobs from '../models/Jobs';
import Applyjobs from '../models/Applyjobs';
import bodyParser = require('body-parser');
import Company from '../models/Company';
import Category from '../models/Category';



export class UserValidators{
  
    static register(){
        return [
                body('firstName','First Name Is Requerd').isString(),
                body('lastName','Last Name Is Requerd').isString(),
               // body('phone','Phone Number Is Requerd').isNumeric(),
               // body('profile_pic', 'You must select an image.').isEmpty(),
               // body('password','Password is Requerd').isAlphanumeric(),
              //  body('location','Location is Requerd').isString(),
               // body('nationality','nationality is Requerd').isString(),
              //  body('nationality','nationality is Requerd').isString(),
               // body('currentJob','currentJob is Requerd').isString(),
               // body('yearOfExp','yearOfExp is Requerd').isString(),
               // body('availability','availability is Requerd').isString(),
                body('email','Email is Requerd').isEmail()
                .custom((email,{req})=>{
                   return User.findOne({'email':email}).then((user)=>{
                        if(user){
                            throw new Error('User All Ready Exits');
                           
                        }else{
                            return true
                        }
                    })
                })]
    }

    static registerEdit(){

        return [body('user_id','User Id is Requerd').isAlphanumeric().
                custom((user_id,{req})=>{
                    return User.findOne({'_id':user_id}).then((user)=>{
                        if(user){
                            req.user = user;
                            return true
                        }else{
                            throw new Error('User Id Not Exit');
                        }
                    })
                })]

    }

    static registerUpdate(){
        return[body('firstName','firstName is Requerd').isString(),
                body('lastName','LastName is Requerd').isString(),
                body('email','Email is Requerd').isString(),
                body('phone','Phone is Requerd').isString(),
                body('location','Location IS Requred').isString(),
                body('nationality','Nationality is Requerd').isString(),
                body('currentJob','CurrentJob is Requerd').isString(),
                body('yearOfExp','yearOfExp is Requerd').isString(),
                body('availability','availability is Requerd').isString(),
                body('user_id','User id is Requerd').isAlphanumeric().custom((user_id,{req})=>{
                    return User.findOne({'_id':user_id}).then((user)=>{
                        if(user){
                           req.user = user;
                           return true
                        }else{
                          throw new Error('User Id Not Exit')
                        }
                    })
                })]
    }

    static resgisterDelete(){
        return [body('user_id','User Id is Requrd').isAlphanumeric().custom((user_id,{req})=>{
            return User.findOne({'_id':user_id}).then((user)=>{
                if(user){
                    req.user = user;
                    return true;
                }else{
                    throw new Error('User Id is Requerd')
                }
            })
        })]
    }

    static registerEmploy(){
        return [
                body('firstName','First Name Is Requerd').isString(),
                body('lastName','Last Name Is Requerd').isString(),
                body('password','Password is Requerd').isAlphanumeric(),
                body('websiteUrl','websiteUrl is Requerd').isURL(),
                body('location','Location is Requerd').isString(),
                body('nationality','Nationality is Requerd').isString(),
                body('companyName','companyName is Requerd').isString(),
                body('industryType','industryType is Requerd').isString(),
                body('numberOfEmployee','numberOfEmployee is Requerd').isString(),
                body('contactPerson','contactPerson is Requerd').isString(),
                body('emailNotification','emailNotification is Requerd').isString(),
                body('companyPhone','companyPhone is Requerd').isString(),
                body('companyAddress','companyAddress is Requerd').isString(),
                body('phone','Phone Number Is Requerd').isNumeric(),
                body('email','Email is Requerd').isEmail()
                .custom((email,{req})=>{
                   return User.findOne({'email':email}).then((user)=>{
                        if(user){
                            throw new Error('User All Ready Exits');
                        }else{
                            return true
                        }
                    })
                })]
    }

    static companyUpdate(){

        return [
            body('firstName','First Name Is Requerd').isString(),
            body('comp_id','comp_id  Is Requerd').isAlphanumeric(),
            body('lastName','Last Name Is Requerd').isString(),
            body('websiteUrl','websiteUrl is Requerd').isURL(),
            body('location','Location is Requerd').isString(),
            body('nationality','Nationality is Requerd').isString(),
            body('companyName','companyName is Requerd').isString(),
            body('industryType','industryType is Requerd').isString(),
            body('numberOfEmployee','numberOfEmployee is Requerd').isString(),
            body('contactPerson','contactPerson is Requerd').isString(),
            body('emailNotification','emailNotification is Requerd').isString(),
            body('companyPhone','companyPhone is Requerd').isString(),
            body('companyAddress','companyAddress is Requerd').isString(),
            body('phone','Phone Number Is Requerd').isNumeric(),
            body('email','Email is Requerd').isEmail()]
    }

    static loginUser(){
        return [body('password','Password is Requerd').isAlphanumeric(),
        body('email','Email is Requerd').isEmail()
        .custom((email,{req})=>{
           return User.findOne({'email':email}).then((user)=>{
                if(user){
                    req.user=user;
                   return true
                }else{
                    throw new Error('User not Exits');
                }
            })
        })] 
    }


    static resendVerificationEmail(){
        return [body('email','Email is Requerd').isEmail()]
    }

    static updatePassword(){
        return [body('password','Password is Requerd').isAlphanumeric(),
                body('confirm_password','Password is Requerd').isAlphanumeric(),
               body('new_password','new Password Requerd').isAlphanumeric()
             .custom((newPassword,{req})=>{
               if(newPassword===req.body.confirm_password){
                   
                   return true
               }else{
                   req.errorStatus = 422;
                   throw new Error('Password and Confirm Password Not Match')
               }
             })]
    }
   
    static resetPassword(){
        return [body('email','Email is Requerd').isEmail()
        .custom((email,{req})=>{
           return User.findOne({'email':email}).then((user)=>{
                if(user){
                   return true
                }else{
                    throw new Error('User not Exits');
                }
            })
        })]
    }


    static verifiyRestPassword(){
        return [body('reset_password_token','Rest Password Token is Requerd').isAlphanumeric()
                .custom((token,{req})=>{
                    return User.findOne({'reset_password_token':token})
                    .then((user)=>{
                        if(user){
                          //  req.user = user;
                            return true
                        }else{
                            throw new Error("Your Token not Exits")
                        }
                    })
                })]
    }

    static forUpdatePassword(){
        return [body('email','Email Field Is Requerd').isEmail()
                .custom((email,{req})=>{
               return  User.findOne({'email':email}).then((user)=>{
                       if(user){
                           return true;
                       }else{
                           throw new Error("email is Not Exit");
                       }
                })
                }),
            body('password','Password Is Requerd').isAlphanumeric()]
    }


    static updateProfilePic(){
     return [body('profile_pic').custom((profilePic,{req})=>{
         console.log(req.file);
         if(req.file){
             return true;
         }else{
             throw new Error('file not Uploaded');
         }
     })]
    }


    static jobsPost(){
        return[body('jobsType','Jobs Type Required').isString(),
               body('skills','Skills is Required').isString(),
               body('exprence','Exprence is Required').isString(),
               body('location','Location is Required').isString(),
               body('category','Category is Required').isString(),
               body('industries','Industries is Required').isString(),
               body('package','Package is Required').isString(),
               body('education','Education is Required').isString(),
               body('JobSummary','JobSummary is Required').isString(),
               body('ResponsibilitiesDuties','ResponsibilitiesDuties is Required').isString(),
               body('user_id',' User id Required').isAlphanumeric()]
    }

    static updateJobsDetails(){
        return [body('jobsType','Jobs Type Requird').isString(),
                body('skills','Skills is Requird').isString(),
                body('exprence','Exprence is Requird').isString(),
                body('package','Package is Requird').isString(),
                body('education','Education is Requird').isString(),
                body('JobSummary','JobSummary is Requird').isString(),
                body('ResponsibilitiesDuties','ResponsibilitiesDuties is Requird').isString()]
    }

    static applyJobs(){
        return [body('jobs_id','Jobs Id Requird').isAlphanumeric(),
             body('user_id','user Id Requird').isAlphanumeric()
                .custom((user_id,{req})=>{
                    return User.findOne({'_id':user_id}).
                    then((user)=>{
                        if(user){
                            req.user = user;
                            return true;
                        }else{
                            throw new Error("User is Not Exit");
                        }
                    })
                })]
    }


    static getAlluser(){
        
        return [body('user_id','user Id Requird').isAlphanumeric()
           .custom((user_id,{req})=>{
               return User.findOne({'_id':user_id}).
               then((user)=>{
                   if(user){
                       req.user = user;
                       return true;
                   }else{
                       throw new Error("User is Not Exit");
                   }
               })
           })]
    }

    static allApplyUser(){
        return [body('jobs_id','user Id Requird').isAlphanumeric()
                .custom((jobs_id,{req})=>{
                    return Applyjobs.findOne({'jobs_id':jobs_id}).
                    then((user)=>{
                        if(user){
                            req.user = user;
                            return true;
                        }else{
                            throw new Error("User is Not Exit");
                        }
                    })
                })]
    }

    static registerEmpDelete(){
        return [body('cmp_id','Company Id Is Requerd').isAlphanumeric().custom((cmp_id,{req})=>{
            return Company.findOne({'_id':cmp_id}).
            then((comp)=>{
                if(comp){
                    req.comp = comp;
                    return true
                }else{
                    throw new Error("User is Not Exit");
                }
            }) 
        })]
    }



    static companyEdit(){
        return [body('cmp_id','Company Id is Requerd').isAlphanumeric().custom((cmp_id,{req})=>{
            return Company.findOne({'_id':cmp_id}).then((cmp)=>{
                if(cmp){
                  req.cmp= cmp;
                  return true
                }else{
                    throw new Error("User is Not Exit");
                }
            })
        })]
    }

    static inteviewUser(){
        return [body('jobs_id','Jobs id is Requird').isAlphanumeric(),
                body('user_id','User id is Requird ').isAlphanumeric(),
                ]
    }

    static locationBy(){
        return [body('location','Location id is Requird').isAlphanumeric()]
        
    }
    
    static categoryby(){
        return [body('category','Category  is Requird').isString()]
    }

    static typeby(){
        return [body('jobsType','jobsType  is Requird').isString()]
    }

    static industries(){
        return [body('industries','Industries  is Requird').isString()]
    }


    static category(){
        return [body('name','Category Name is Requerd').isString().custom((name,{req})=>{
            return Category.findOne({'name':name}).then((cate)=>{
                if(cate){
                   throw new Error('Category Name Allready Exit')
                }else{
                  return true;
                }
            })
        })]
    }

    static categoryUpdate(){
        return [body('name','Category Name is Requerd').isString().custom((name,{req})=>{
            return Category.findOne({'name':name}).then((cate)=>{
                if(cate){
                   throw new Error('Category Name Allready Exit')
                }else{
                  return true;
                }
            })
        }),
        body('cat_id','Category Id is Requerd').isAlphanumeric().custom((cat_id,{req})=>{
            return Category.findOne({'_id':cat_id}).then((cate)=>{
              if(cate){
                req.cate = cate;
                return true;
              }else{
                throw new Error('Category does not Exit')
              }
            })
        })]
    }

    static categoryEdit(){
        return [body('cat_id','Category Id is Requerd').isAlphanumeric().custom((cat_id,{req})=>{
            return Category.findOne({'_id':cat_id}).then((cate)=>{
              if(cate){
                req.cate = cate;
                return true;
              }else{
                throw new Error('Category does not Exit')
              }
            })
        })]
     }

     static categoryDelete(){
        body('cat_id','Category Id is Requerd').isAlphanumeric().custom((cat_id,{req})=>{
            return Category.findOne({'_id':cat_id}).then((cate)=>{
              if(cate){
                req.cate = cate;
                return true;
              }else{
                throw new Error('Category does not Exit')
              }
            })
        })
     }






}