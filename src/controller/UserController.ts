import User from '../models/User';
import { validationResult, body } from 'express-validator';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import {Utils} from '../utils/Utils';
 import {NodeMailer} from '../utils/NodeMailer';
 import jobs from '../models/Jobs';
 import Applyjobs from '../models/Applyjobs';
 import Interview from '../models/Interview';
 import Counter from '../models/Counter';
 import Company from '../models/Company';
 import Training from '../models/Training'
import Category from '../models/Category';


export class UserController{

    static login(req,res,next){
     // res.setHeader('Content-Type', 'text/plain');
      const password = req.body.password;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
       const newError = new Error(errors.array()[0].msg)
       //  return res.status(422).json({ errors: errors.array() });
       next(newError);
       //console.log(errors.array())
     }
     
      const user = req.user
      if(user){
        bcrypt.compare(password, user.password, function(err, result) {
          if(err){
            next(new Error(err.message))
  
          }else if(!result){
            next(new Error('User And Password Not Match'))
          }else{
            const data = {
              user_id : req.user._id,
              email: req.user.email
  
            }
            const userdata = {
              email: user.email,
              user_id: user._id,
  
            }
              
            const token = jwt.sign(data, 'secret',{expiresIn: '120d'});
            res.json({token:token,
                      user:userdata,
                      status:'true',
                      code:'200',
                      message:'user login Success'});
                      
          }
      });
      }
    
   

      //res.send(req.user);
       
        }


  static async register(req,res,next){
    const errors = validationResult(req);
    //console.log(errors);
    if (!errors.isEmpty()) {
      //const newError = new Error(errors.array()[0].msg)
        return res.status(422).json({ error: errors.array()[0].msg,
                                       error_code:422 });
    
    }

    if(req.file){

      const cvUploaded = req.file.originalname;
      const email = req.body.email;
      const firstName = req.body.firstName;
      const lastName = req.body.lastName;
      const password = req.body.password;
      const phone = req.body.phone;
      const dob = req.body.dob;
      const gender = req.body.gender;
      const location = req.body.location;
      const nationality = req.body.nationality;
      const qualification = req.body.qualification;
      const currentJob = req.body.currentJob;
      const yearOfExp = req.body.yearOfExp;
      const availability = req.body.availability;

    try{
    // const  hash = ''
    const verificationToken= Utils.generatedverificationToken();
       
        const hash = await bcrypt.hash(password, 10);
        const data = {
          email:email,
          password:hash,
          firstName:firstName,
          lastName:lastName,
          cvUploaded:cvUploaded,
          phone:phone,
          dob:dob,
          gender:gender,
          location:location,
          nationality:nationality,
          qualification:qualification,
          currentJob:currentJob,
          yearOfExp:yearOfExp,
          availability:availability,
          verificationToken:verificationToken
  
        }
        let user = await new User(data).save();
         if(user){
           res.json({
                status:'true',
                code:'200',
                message:'user Register Success'
           })

           await NodeMailer.sendEmail({
            to:['ranjeetvit2012@gmail.com']
            ,subject:'test'
            ,html:`<h1>${verificationToken}</h1>`
           })
         }else{
          res.json({
            status:'true',
            code:'422',
            message:'user not Register Success'
       })
     }

    }catch(err){
      next(err);
    }
    }else{
      return res.status(422).json({ error:'images file is empty',
        error_code:422 });
    }
    


    
  }

  static async registerEdit(req,res,next){
      
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(422).json({
        error:errors.array()[0].msg
      })
    }

    res.json({
       status:true,
       code:200,
       data:req.user,
       message:'Edit User Data'
    })

  }


  static async registerUpdate(req,res,next){

   const  errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(422).json({error:errors.array()[0].msg})
    }

     const dataup = {
         firstName:req.body.firstName,
         lastName: req.body.lastName,
         email:req.body.email,
         phone:req.body.phone,
         location:req.body.location,
         nationality:req.body.nationality,
         currentJob:req.body.currentJob,
         yearOfExp:req.body.yearOfExp,
         availability:req.body.availability
         
     }

      const user_id = req.user._id;


    try{

      const userDatas = await User.findByIdAndUpdate({'_id':user_id},dataup,{new:true});
       
      if(userDatas){
        res.json({
          status:true,
          code:200,
          message:'User Update Successs'
        })
      }else{
        res.json({
          status:false,
          code:422,
          message:'User Not Update'
        })
      }

    }catch(err){
      next(err);
    }
  }

  static async resgisterDelete(req,res,next){
     const errors = validationResult(req);
     if(!errors.isEmpty()){
       return res.status(422).json({
         error:errors.array()[0].msg
       })
     }
    const user_id = req.user._id;
    //console.log(user_id);
    try{
       
      User.findByIdAndDelete(user_id, function (err, docs) { 
        if (err){ 
          res.json({
                 status:false,
                 code:422,
                 message:err
               })
        } 
        else{ 
                res.json({
          status:true,
            code:200,
            message:'User Delete Successfully'
          })
        } 
    }); 

    }catch(err){
      next(err);
    }
  }

  static async registerEmp(req,res,next){

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      //const newError = new Error(errors.array()[0].msg)
      return res.status(422).json({ error: errors.array()[0].msg });
     // next(newError);
      //console.log(errors.array())
    }

   
    const hash = await bcrypt.hash(req.body.password, 10);
    const email = req.body.email;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const password = hash;
    const phone = req.body.phone;
    const location = req.body.location;
    const nationality = req.body.nationality;
    const companyProfile = req.body.companyProfile;
    const companyName = req.body.companyName;
    const industryType = req.body.industryType;
    const numberOfEmployee = req.body.numberOfEmployee;
    const websiteUrl = req.body.websiteUrl;
    const contactPerson = req.body.contactPerson;
    const contactEmail = req.body.contactEmail;
    const companyPhone = req.body.companyPhone;
    const companyAddress = req.body.companyAddress;
    const emailNotification = req.body.emailNotification;
   
    

    try{
    // const  hash = ''
    const verificationToken = Utils.generatedverificationToken();
        const data = {
          email:email,
          password:password,
          firstName:firstName,
          lastName:lastName,
          phone:phone,
          location:location,
          nationality:nationality,
          companyProfile:companyProfile,
          companyName:companyName,
          industryType:industryType,
          numberOfEmployee:numberOfEmployee,
          websiteUrl:websiteUrl,
          contactPerson:contactPerson,
          contactEmail:contactEmail,
          companyPhone:companyPhone,
          companyAddress:companyAddress,
          emailNotification:emailNotification,
          verificationToken:verificationToken,
        
  
        }

     
        let user = await new Company(data).save();
        if(user){
          res.json({
               status:'true',
               code:'200',
               message:'user Register Success'
          })

          await NodeMailer.sendEmail({
           to:['ranjeetvit2012@gmail.com']
           ,subject:'test'
           ,html:`<h1>${verificationToken}</h1>`
          })
        }else{
         res.json({
           status:'true',
           code:'422',
           message:'user not Register Success'
      })
        }
    }catch(err){
      next(err);
    }


   

  }

   static companyEdit(req,res,next){
      
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      //const newError = new Error(errors.array()[0].msg)
      return res.status(422).json({ error: errors.array()[0].msg });
     // next(newError);
      //console.log(errors.array())
    }

   
      res.json({
        status:true,
        code:200,
        data:req.cmp,
        message:'Company Details data'
      })
   

   }


  static async companyUpdate(req,res,next){
       

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      //const newError = new Error(errors.array()[0].msg)
      return res.status(422).json({ error: errors.array()[0].msg });
     // next(newError);
      //console.log(errors.array())
    }

   
   // const hash = await bcrypt.hash(req.body.password, 10);
    const email = req.body.email;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    // const password = hash;
    const phone = req.body.phone;
    const location = req.body.location;
    const nationality = req.body.nationality;
    const companyProfile = req.body.companyProfile;
    const companyName = req.body.companyName;
    const industryType = req.body.industryType;
    const numberOfEmployee = req.body.numberOfEmployee;
    const websiteUrl = req.body.websiteUrl;
    const contactPerson = req.body.contactPerson;
    const contactEmail = req.body.contactEmail;
    const companyPhone = req.body.companyPhone;
    const companyAddress = req.body.companyAddress;
    const emailNotification = req.body.emailNotification;
    const comp_id = req.body.comp_id;

   
    

    try{
    // const  hash = ''
// const verificationToken = Utils.generatedverificationToken();
        const data = {
          email:email,
         // password:password,
          firstName:firstName,
          lastName:lastName,
          phone:phone,
          location:location,
          nationality:nationality,
          companyProfile:companyProfile,
          companyName:companyName,
          industryType:industryType,
          numberOfEmployee:numberOfEmployee,
          websiteUrl:websiteUrl,
          contactPerson:contactPerson,
          contactEmail:contactEmail,
          companyPhone:companyPhone,
          companyAddress:companyAddress,
          emailNotification:emailNotification,
         
        }

      
        let user = await Company.findByIdAndUpdate({'_id':comp_id},data,{new:true});
        if(user){
          res.json({
               status:'true',
               code:'200',
               message:'user Register Update Success'
          })

         
        }else{
         res.json({
           status:'true',
           code:'422',
           message:'user Register Update not Success'
      })
        }
    }catch(err){
      next(err);
    }
  }


  static async resendVerificationEmail(req,res,next){
    const errors = validationResult(req);
    const email = req.user.email;
    const verificationToken = Utils.generatedverificationToken();
    try{
   const user = await User.findOneAndUpdate({'email':email},{verificationToken:verificationToken},{new:true});
   if(user){
   const mailer = await NodeMailer.sendEmail({
      to:['ranjeetvit2012@gmail.com']
      ,subject:'test'
      ,html:`<h1>${verificationToken}</h1>`
     })

     res.json({
       success:true
     })

   }else{
      throw Error('User does not Exit');
   }
    }catch(err){
      next(err);
    }
    
    

    if (!errors.isEmpty()) {
      //const newError = new Error(errors.array()[0].msg)
      return res.status(422).json({ email: errors.array()[0].msg });
     // next(newError);
      //console.log(errors.array())
    }
  }
  
  static async passwordUpdate(req,res,next){
    // change password
    const errors = validationResult(req);
    

    if (!errors.isEmpty()) {
      //const newError = new Error(errors.array()[0].msg)
      return res.status(422).json({ email: errors.array()[0].msg });
     // next(newError);
      //console.log(errors.array())
    }
     const user_id = req.user.user_id;
    
     const password = req.body.password;
     //const confirmPassword = req.body.confirm_password;
     const newPassword = req.body.new_password;
        // console.log(newPassword);
        // console.log(password);
        // console.log(confirmPassword);
     try{
       User.findOne({'_id': user_id}).then(async(user: any)=>{
        
        const pdata = await bcrypt.compare(password, user.password);
        const hash = await  bcrypt.hash(newPassword, 10);
        const newUser = await  User.findOneAndUpdate({'_id':user_id},{'password':hash},{new:true})
        res.send(newUser);
       })
     }catch(err){
       next(err);
     }

  }


  static async resetPassword(req,res,next){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //const newError = new Error(errors.array()[0].msg)
      return res.status(422).json({ email: errors.array()[0].msg });
     // next(newError);
      //console.log(errors.array())
    }
     const email = req.body.email;
     const reset_password_token = Utils.generatedverificationToken();
     // console.log(reset_password_token);
     try{
       const updateUser = await User.findOneAndUpdate({'email':email},{'reset_password_token':reset_password_token},{new:true});
       const mailer = await NodeMailer.sendEmail({
        to:['ranjeetvit2012@gmail.com']
        ,subject:'test'
        ,html:`<h1>${reset_password_token}</h1>`
       })
       res.send(updateUser)
     }catch(err){
       next(err);
     }
  }


  static async verifiyRestPassword(req,res,next){
     //res.json({success:true})
     const email = req.body.email;
     
     try{
       const hash = await bcrypt.hash(req.body.password, 10);
       const userUpdate = await User.findOneAndUpdate({'email':email},{'password':hash},{new:true});
       res.send(userUpdate);
     }catch(err){
       next(err);
     }

  }

  static async forUpdatePassword(req,res,next){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //const newError = new Error(errors.array()[0].msg)
      return res.status(422).json({ email: errors.array()[0].msg });
     // next(newError);
      //console.log(errors.array())
    }
    const email = req.body.email;
     
      try{
        const hash = await bcrypt.hash(req.body.password, 10);
        const userUpdate = await User.findOneAndUpdate({'email':email},{'password':hash},{new:true});
        res.send(userUpdate);
      }catch(err){
        next(err);
      }
  }

  static async updateProfilePic(req,res,next){
    
     const user_id = req.user.user_id;
     const cvUploaded = req.file.path;
     try{
      const filter = {'_id':user_id};
      const update = { 'cvUploaded': cvUploaded };
      const user = await User.findOneAndUpdate(filter, update, {
        new: true
      });
      
      // = await User.findOneAndUpdate({'_id':user_id},{'profile_pic_url':profile_pic},{new:true})
      res.send(user);
     }catch(err){
       next(err);
     }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //const newError = new Error(errors.array()[0].msg)
      return res.status(422).json({ email: errors.array()[0].msg });
     // next(newError);
      //console.log(errors.array())
    }
  }

  static async  userData(req,res,next){
     const userType = req.body.userType;
     try{
       
      const user = await User.find({'userType':userType},{ __v: false,create_at:false });
       if(user){
         res.send(user);
       }else{
          throw new Error("User Data Not Found");
       }
     }catch(err){
       next(err);
     }

     const errors = validationResult(req);
     if (!errors.isEmpty()) {
      //const newError = new Error(errors.array()[0].msg)
      return res.status(422).json({ email: errors.array()[0].msg });
     // next(newError);
      //console.log(errors.array())
    }
  }


  static async training(req,res,next){

    const TrainingData = {
      email:req.body.email,
      name:req.body.name,
      phone:req.body.phone,
      address:req.body.address,
     
     }
     
    try{
      const datajob = await new Training(TrainingData).save();
         if(datajob){
           res.json({
             status:true,
             code:200,
             message:'Training Create Successfully',
  
           })
         }else{
          res.json({
            status:false,
            code:422,
            message:'Training not Create Successfully',
  
          })
         }
    }catch(err){
      next(err);
    }

  }

  static async jobsPost(req,res,next){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
     //const newError = new Error(errors.array()[0].msg)
     return res.status(422).json({ error: errors.array()[0].msg,
                                    code:'422' });
   }
    
   const jobsData = {
    jobsType:req.body.jobsType,
    skills:req.body.skills,
    exprence:req.body.exprence,
    package:req.body.package,
    education:req.body.education,
    JobSummary:req.body.JobSummary,
    ResponsibilitiesDuties:req.body.ResponsibilitiesDuties,
    user_id:req.body.user_id,
    location:req.body.location,
    category:req.body.category,
    industries:req.body.industries,
   }
   
  try{
    const datajob = await new jobs(jobsData).save();
       if(datajob){
         res.json({
           status:true,
           code:200,
           message:'Jobs Create Successfully',

         })
       }else{
        res.json({
          status:false,
          code:422,
          message:'Jobs not Create Successfully',

        })
       }
  }catch(err){
    next(err);
  }


  }


  static async getjobsAllData(req,res,next){
    try{

      const jobsData = await jobs.find();
      if(jobsData){
        res.json({
             status:true,
             code:200,
             data:jobsData,
             message:'Jobs data'
        })
      }else{
        res.json({
          status:false,
          code:422,
          message:'jobs Data not found'
        })
      }

    }catch(err){
      next(err);
    }
  }

  static async editJobPostData(req,res,next){
     
      const jobs_id = req.body.jobs_id;

      try{
        const jobsData = await  jobs.findOne({'_id':jobs_id});
        if(jobsData){
          res.json({
            status:true,
            code:200,
            data:jobsData,
            message:'Jobs All Data'
          })
        }else{
          res.json({
            status:false,
            code:422,
            message:'Jobs Data Not Found'
          })
        }
      }catch(err){
        next(err);
      }
  }

  static async updateJobsDetails(req,res,next){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
     //const newError = new Error(errors.array()[0].msg)
     return res.status(422).json({ error: errors.array()[0].msg,
                                    code:'422' });
   }

   const dataup = {
    jobsType:req.body.jobsType,
    skills:req.body.skills,
    exprence:req.body.exprence,
    package:req.body.package,
    education:req.body.education,
    JobSummary:req.body.JobSummary,
    ResponsibilitiesDuties:req.body.ResponsibilitiesDuties
   }
   
   const jobs_id = req.body.jobs_id;

   try{
      const jobsDatas = await jobs.findOneAndUpdate({'_id':jobs_id},dataup,{new: true});
      if(jobsDatas){
         res.json({
           status:true,
           code :200,
           data:jobsDatas,
           message:'Jobs Update Successfully'
         })
      }else{
         res.json({
           status:false,
           code:422,
           message:'jobs not Update'
         })
      }
   }catch(err){
     next(err);
   }


    
  }

  static async applyjobs(req,res,next){
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
     //const newError = new Error(errors.array()[0].msg)
     return res.status(422).json({ error: errors.array()[0].msg,
                                    code:'422' });
   }
  
       const applyData = {
        user_id: req.user._id,
        jobs_id:req.body.jobs_id
       } 
     try{

      const datajob = await new Applyjobs(applyData).save();
      if(datajob){
        res.json({
          status:true,
          code:200,
          message:'Jobs Apply Successfully',

        })
      }else{
       res.json({
         status:false,
         code:422,
         message:'Jobs Apply not  Successfully',

       })
      }

     }catch(err){
       next(err);
     }
  }
  
  static async allApplyUser(req,res,next){
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
     //const newError = new Error(errors.array()[0].msg)
     return res.status(422).json({ error: errors.array()[0].msg,
                                    code:'422' });
   }

   try{
       const jobs_id = req.user.jobs_id;
       const appData = await Applyjobs.aggregate([
        {
          $lookup:
            {
              from: "User",
              localField: "_id",
              foreignField: "user_id",
              as: "inventory_docs"
            }
       }
      ]);
    // const appData = await  Applyjobs.find({'jobs_id':jobs_id});

    if(appData){
      res.json({
        status:true,
        code:200,
        data:appData,
        message:'All User Data',

      })
    }else{
     res.json({
       status:false,
       code:422,
       message:'User not  Successfully',

     })
    }

     
   }catch(err){
     next(err);
   }
  }

  static async applyjobsdelete(req,res,next){
     const applyjobs_id = req.body.applyjobs_id;

    try{

      const deleteData = await Applyjobs.findByIdAndDelete({'_id':applyjobs_id});
        
        if(deleteData){
             res.json({
               status:true,
               code:200,
               message:'ApplyJobs Delete Successfully'
             })
        }else{
          
          res.json({
              status:false,
              code:422,
              message:'Applyjobs Not Delete'
          })
        }

    }catch(err){

    }

  }


  static async getAlluser(req,res,next){

    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
     //const newError = new Error(errors.array()[0].msg)
     return res.status(422).json({ error: errors.array()[0].msg,
                                    code:'422' });
   }

    try{
      const user_id = req.user._id;
      
     // console.log(appData);
     
   const appData = await  User.find({'_id':user_id});
  // console.log(appData);
   if(appData){
     res.json({
       status:true,
       code:200,
       data:appData,
       message:'All User Data',

     })
   }else{
    res.json({
      status:false,
      code:422,
      message:'User not  Successfully',

    })
   }

    
  }catch(err){
    next(err);
  }

  }

  static async inteviewUser(req,res,next){

    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
     //const newError = new Error(errors.array()[0].msg)
     return res.status(422).json({ error: errors.array()[0].msg,
                                    code:'422' });
   }

   const interData = {
      jobs_id:req.body.jobs_id,
      user_id:req.body.user_id,
      date:req.body.date,
      time:req.body.time

   }
   try{
      const inteData = new Interview(interData).save();
      if(inteData){
          res.json({
            status:true,
            code: 200,
            message:'Interview created success'

          })
      }else{
          res.json({
            status:false,
            code:422,
            message:'Interview Not Created'
          })
      }
   }catch(err){
     next(err);
   }

  }

  static async inteviewAllData(req,res,next){
    
    try{

      const interData = await Interview.find();
    
      if(interData){
        res.json({
          status:true,
          data:interData,
          code:200,
          message:'Interview All Data'
        })
      }else{
        res.json({
           status:false,
           code:422,
           message:'Interview Data Not Found'
        })
      }

    }catch(err){
      next(err);
    }
  }

  static async jobsDelete(req,res,next){
      const jobs_id = req.body.jobs_id;
      try{
       ///  const dataDelete  = await jobs.findOneAndDelete({'_id':jobs_id});
         jobs.findByIdAndDelete(jobs_id, function (err, docs) { 
          if (err){ 
            res.json({
                   status:false,
                   code:422,
                   message:err
                 })
          } 
          else{ 
                  res.json({
            status:true,
              code:200,
              message:'User Delete Successfully'
            })
          } 
      }); 
      }catch(err){
        next(err);
      }
  }

  static async locationBy(req,res,next){
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
     //const newError = new Error(errors.array()[0].msg)
     return res.status(422).json({ error: errors.array()[0].msg,
                                    code:'422' });
   }
       const location = req.body.location;
    try{

      const searchData = await jobs.find({'location':location})
      if(searchData.length >0){
         res.json({
           status:true,
           code:200,
           data:searchData,
           message:'Search Location by Data'
         })
      }else{
         res.json({
           status:false,
           code:422,
           message:'Search Data Not Found'
         })
      }

    }catch(err){
      next(err);
    }
  }

  static async categoryby(req,res,next){
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
     //const newError = new Error(errors.array()[0].msg)
     return res.status(422).json({ error: errors.array()[0].msg,
                                    code:'422' });
   }
    const category = req.body.category;
      try{ 
        const categoryData = await jobs.find({'category':category});
        if(categoryData.length >0){
            res.json({
              status:true,
              code:200,
              data:categoryData,
              message:'Category By search Data'
            })
        }else{
          res.json({
            status:false,
            code:422,
            message:'Category Data Not Found'
          })
        }

      }catch(err){
        next(err);
      }
  }

  static async typeby(req,res,next){
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
     //const newError = new Error(errors.array()[0].msg)
     return res.status(422).json({ error: errors.array()[0].msg,
                                    code:'422' });
   }
    const jobsType = req.body.jobsType;
    try{
       
       // const data =  {"name": "Bangladesh", "code": "BD"}
       
       // let user = await new Counter(data).save();
       const typeData = await jobs.find({'jobsType':jobsType});
         if(typeData.length>0){
          res.json({
              status:true,
              code:200,
              data:typeData,
              message:'Search By Type Data'
          })
         }else{
            
          res.json({
            status:false,
            code:422,
            message:'Search By Type not Data'
        })
         }
    }catch(err){
      next(err);
    }
  }

  static async industries (req,res,next){
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
     //const newError = new Error(errors.array()[0].msg)
     return res.status(422).json({ error: errors.array()[0].msg,
                                    code:'422' });
   }

     try{

      var laptopData = [
       
{"name": "Barbados", "code": "BB"},
{"name": "Belarus", "code": "BY"},
{"name": "Belgium", "code": "BE"},
{"name": "Belize", "code": "BZ"},
{"name": "Benin", "code": "BJ"},
{"name": "Bermuda", "code": "BM"},
{"name": "Bhutan", "code": "BT"},
{"name": "Bolivia", "code": "BO"},
{"name": "Bosnia and Herzegovina", "code": "BA"},
{"name": "Botswana", "code": "BW"},
{"name": "Bouvet Island", "code": "BV"},
{"name": "Brazil", "code": "BR"},
{"name": "British Indian Ocean Territory", "code": "IO"},
{"name": "Brunei Darussalam", "code": "BN"},
{"name": "Bulgaria", "code": "BG"},
{"name": "Burkina Faso", "code": "BF"},
{"name": "Burundi", "code": "BI"},
{"name": "Cambodia", "code": "KH"},
{"name": "Cameroon", "code": "CM"},
{"name": "Canada", "code": "CA"},
{"name": "Cape Verde", "code": "CV"},
{"name": "Cayman Islands", "code": "KY"},
{"name": "Central African Republic", "code": "CF"},
{"name": "Chad", "code": "TD"},
{"name": "Chile", "code": "CL"},
{"name": "China", "code": "CN"},
{"name": "Christmas Island", "code": "CX"},
{"name": "Cocos (Keeling) Islands", "code": "CC"},
{"name": "Colombia", "code": "CO"},
{"name": "Comoros", "code": "KM"},
{"name": "Congo", "code": "CG"},
{"name": "Congo, The Democratic Republic of the", "code": "CD"},
{"name": "Cook Islands", "code": "CK"},
{"name": "Costa Rica", "code": "CR"},
{"name": "Cote D", "code": "CI"},
{"name": "Croatia", "code": "HR"},
{"name": "Cuba", "code": "CU"},
{"name": "Cyprus", "code": "CY"},
{"name": "Czech Republic", "code": "CZ"},
{"name": "Denmark", "code": "DK"},
{"name": "Djibouti", "code": "DJ"},
{"name": "Dominica", "code": "DM"},
{"name": "Dominican Republic", "code": "DO"},
{"name": "Ecuador", "code": "EC"},
{"name": "Egypt", "code": "EG"},
{"name": "El Salvador", "code": "SV"},
{"name": "Equatorial Guinea", "code": "GQ"},
{"name": "Eritrea", "code": "ER"},
{"name": "Estonia", "code": "EE"},
{"name": "Ethiopia", "code": "ET"},
{"name": "Falkland Islands (Malvinas)", "code": "FK"},
{"name": "Faroe Islands", "code": "FO"},
{"name": "Fiji", "code": "FJ"},
{"name": "Finland", "code": "FI"},
{"name": "France", "code": "FR"},
{"name": "French Guiana", "code": "GF"},
{"name": "French Polynesia", "code": "PF"},
{"name": "French Southern Territories", "code": "TF"},
{"name": "Gabon", "code": "GA"},
{"name": "Gambia", "code": "GM"},
{"name": "Georgia", "code": "GE"},
{"name": "Germany", "code": "DE"},
{"name": "Ghana", "code": "GH"},
{"name": "Gibraltar", "code": "GI"},
{"name": "Greece", "code": "GR"},
{"name": "Greenland", "code": "GL"},
{"name": "Grenada", "code": "GD"},
{"name": "Guadeloupe", "code": "GP"},
{"name": "Guam", "code": "GU"},
{"name": "Guatemala", "code": "GT"},
{"name": "Guernsey", "code": "GG"},
{"name": "Guinea", "code": "GN"},
{"name": "Guinea-Bissau", "code": "GW"},
{"name": "Guyana", "code": "GY"},
{"name": "Haiti", "code": "HT"},
{"name": "Heard Island and Mcdonald Islands", "code": "HM"},
{"name": "Holy See (Vatican City State)", "code": "VA"},
{"name": "Honduras", "code": "HN"},
{"name": "Hong Kong", "code": "HK"},
{"name": "Hungary", "code": "HU"},
{"name": "Iceland", "code": "IS"},
{"name": "India", "code": "IN"},
{"name": "Indonesia", "code": "ID"},
{"name": "Iran, Islamic Republic Of", "code": "IR"},
{"name": "Iraq", "code": "IQ"},
{"name": "Ireland", "code": "IE"},
{"name": "Isle of Man", "code": "IM"},
{"name": "Israel", "code": "IL"},
{"name": "Italy", "code": "IT"},
{"name": "Jamaica", "code": "JM"},
{"name": "Japan", "code": "JP"},
{"name": "Jersey", "code": "JE"},
{"name": "Jordan", "code": "JO"},
{"name": "Kazakhstan", "code": "KZ"},
{"name": "Kenya", "code": "KE"},
{"name": "Kiribati", "code": "KI"},
{"name": "Korea, Democratic People", "code": "KP"},
{"name": "Korea, Republic of", "code": "KR"},
{"name": "Kuwait", "code": "KW"},
{"name": "Kyrgyzstan", "code": "KG"},
{"name": "Lao People", "code": "LA"},
{"name": "Latvia", "code": "LV"},
{"name": "Lebanon", "code": "LB"},
{"name": "Lesotho", "code": "LS"},
{"name": "Liberia", "code": "LR"},
{"name": "Libyan Arab Jamahiriya", "code": "LY"},
{"name": "Liechtenstein", "code": "LI"},
{"name": "Lithuania", "code": "LT"},
{"name": "Luxembourg", "code": "LU"},
{"name": "Macao", "code": "MO"},
{"name": "Macedonia, The Former Yugoslav Republic of", "code": "MK"},
{"name": "Madagascar", "code": "MG"},
{"name": "Malawi", "code": "MW"},
{"name": "Malaysia", "code": "MY"},
{"name": "Maldives", "code": "MV"},
{"name": "Mali", "code": "ML"},
{"name": "Malta", "code": "MT"},
{"name": "Marshall Islands", "code": "MH"},
{"name": "Martinique", "code": "MQ"},
{"name": "Mauritania", "code": "MR"},
{"name": "Mauritius", "code": "MU"},
{"name": "Mayotte", "code": "YT"},
{"name": "Mexico", "code": "MX"},
{"name": "Micronesia, Federated States of", "code": "FM"},
{"name": "Moldova, Republic of", "code": "MD"},
{"name": "Monaco", "code": "MC"},
{"name": "Mongolia", "code": "MN"},
{"name": "Montserrat", "code": "MS"},
{"name": "Morocco", "code": "MA"},
{"name": "Mozambique", "code": "MZ"},
{"name": "Myanmar", "code": "MM"},
{"name": "Namibia", "code": "NA"},
{"name": "Nauru", "code": "NR"},
{"name": "Nepal", "code": "NP"},
{"name": "Netherlands", "code": "NL"},
{"name": "Netherlands Antilles", "code": "AN"},
{"name": "New Caledonia", "code": "NC"},
{"name": "New Zealand", "code": "NZ"},
{"name": "Nicaragua", "code": "NI"},
{"name": "Niger", "code": "NE"},
{"name": "Nigeria", "code": "NG"},
{"name": "Niue", "code": "NU"},
{"name": "Norfolk Island", "code": "NF"},
{"name": "Northern Mariana Islands", "code": "MP"},
{"name": "Norway", "code": "NO"},
{"name": "Oman", "code": "OM"},
{"name": "Pakistan", "code": "PK"},
{"name": "Palau", "code": "PW"},
{"name": "Palestinian Territory, Occupied", "code": "PS"},
{"name": "Panama", "code": "PA"},
{"name": "Papua New Guinea", "code": "PG"},
{"name": "Paraguay", "code": "PY"},
{"name": "Peru", "code": "PE"},
{"name": "Philippines", "code": "PH"},
{"name": "Pitcairn", "code": "PN"},
{"name": "Poland", "code": "PL"},
{"name": "Portugal", "code": "PT"},
{"name": "Puerto Rico", "code": "PR"},
{"name": "Qatar", "code": "QA"},
{"name": "Reunion", "code": "RE"},
{"name": "Romania", "code": "RO"},
{"name": "Russian Federation", "code": "RU"},
{"name": "RWANDA", "code": "RW"},
{"name": "Saint Helena", "code": "SH"},
{"name": "Saint Kitts and Nevis", "code": "KN"},
{"name": "Saint Lucia", "code": "LC"},
{"name": "Saint Pierre and Miquelon", "code": "PM"},
{"name": "Saint Vincent and the Grenadines", "code": "VC"},
{"name": "Samoa", "code": "WS"},
{"name": "San Marino", "code": "SM"},
{"name": "Sao Tome and Principe", "code": "ST"},
{"name": "Saudi Arabia", "code": "SA"},
{"name": "Senegal", "code": "SN"},
{"name": "Serbia and Montenegro", "code": "CS"},
{"name": "Seychelles", "code": "SC"},
{"name": "Sierra Leone", "code": "SL"},
{"name": "Singapore", "code": "SG"},
{"name": "Slovakia", "code": "SK"},
{"name": "Slovenia", "code": "SI"},
{"name": "Solomon Islands", "code": "SB"},
{"name": "Somalia", "code": "SO"},
{"name": "South Africa", "code": "ZA"},
{"name": "South Georgia and the South Sandwich Islands", "code": "GS"},
{"name": "Spain", "code": "ES"},
{"name": "Sri Lanka", "code": "LK"},
{"name": "Sudan", "code": "SD"},
{"name": "Suriname", "code": "SR"},
{"name": "Svalbard and Jan Mayen", "code": "SJ"},
{"name": "Swaziland", "code": "SZ"},
{"name": "Sweden", "code": "SE"},
{"name": "Switzerland", "code": "CH"},
{"name": "Syrian Arab Republic", "code": "SY"},
{"name": "Taiwan, Province of China", "code": "TW"},
{"name": "Tajikistan", "code": "TJ"},
{"name": "Tanzania, United Republic of", "code": "TZ"},
{"name": "Thailand", "code": "TH"},
{"name": "Timor-Leste", "code": "TL"},
{"name": "Togo", "code": "TG"},
{"name": "Tokelau", "code": "TK"},
{"name": "Tonga", "code": "TO"},
{"name": "Trinidad and Tobago", "code": "TT"},
{"name": "Tunisia", "code": "TN"},
{"name": "Turkey", "code": "TR"},
{"name": "Turkmenistan", "code": "TM"},
{"name": "Turks and Caicos Islands", "code": "TC"},
{"name": "Tuvalu", "code": "TV"},
{"name": "Uganda", "code": "UG"},
{"name": "Ukraine", "code": "UA"},
{"name": "United Arab Emirates", "code": "AE"},
{"name": "United Kingdom", "code": "GB"},
{"name": "United States", "code": "US"},
{"name": "United States Minor Outlying Islands", "code": "UM"},
{"name": "Uruguay", "code": "UY"},
{"name": "Uzbekistan", "code": "UZ"},
{"name": "Vanuatu", "code": "VU"},
{"name": "Venezuela", "code": "VE"},
{"name": "Viet Nam", "code": "VN"},
{"name": "Virgin Islands, British", "code": "VG"},
{"name": "Virgin Islands, U.S.", "code": "VI"},
{"name": "Wallis and Futuna", "code": "WF"},
{"name": "Western Sahara", "code": "EH"},
{"name": "Yemen", "code": "YE"},
{"name": "Zambia", "code": "ZM"},
{"name": "Zimbabwe", "code": "ZW"}
      ];
// for(var laptopItem in laptopData){
 
//   const datacou  = await new Counter(laptopData[laptopItem])
//       .save();
//       res.send(datacou);
    
      
// }
const industri =await Counter.insertMany(laptopData);
res.send(industri);
    
       const industriesData = await jobs.find({'industries':req.body.industries});
       if(industriesData.length>0){
        res.json({
            status:true,
            code:200,
            data:industriesData,
            message:'Search By Type Data'
        })
       }else{
          
        res.json({
          status:false,
          code:422,
          message:'Search By Type not Data'
      })
    }
     }catch(err){
       next(err)
     }
  }

  static userDelete(req,res,next){
    const user_id = req.user.user_id;
    
  }

  static async registerEmpDelete(req,res,next){
       
     const cmp_id = req.bodyl.cmp_id;

     try{
    //  54.251.144.165
      // const deleteUser = await .findByIdAndDelete({'_id':cmp_id});
       Company.findByIdAndDelete(cmp_id, function (err, docs) { 
        if (err){ 
          res.json({
                 status:false,
                 code:422,
                 message:err
               })
        } 
        else{ 
                res.json({
          status:true,
            code:200,
            message:'User Delete Successfully'
          })
        } 
    }); 

     }catch(err){
       next(err);
     }
    
  }

  static async category(req,res,next){
    const errors= validationResult(req);

    if(!errors.isEmpty()){
      return res.status(422).json({ error: errors.array()[0].msg,
        code:'422' });
      
    }


    try{

       const datacat = {
          name:req.body.name
       }

       const catData = await new Category(datacat).save();

       if(catData){
          res.json({
            status:true,
            code:200,
            message:'Category create success'
          })
       }else{
         res.json({
           status:false,
           code:422,
           message:'Category not Created'
         })
       }

    }catch(err){
      next(err);
    }



  }


  static async allCategory(req,res,next){

    try{
       
    const categoryData = await Category.find();
     
    if(categoryData.length>0){

      res.json({
        status:true,
        code:200,
        data:categoryData,
        message:'All Category Data'
      })

    }else{

      res.json({
        status:false,
        code:422,
        message:'Data not Found'
      })
      
    }
       
    }catch(err){
      next(err);
    }
  }

  static categoryEdit(req,res,next){
      
    const errors = validationResult(req);
    if(!errors.isEmpty()){
       
      return res.status(422).json({error:errors.array()[0].msg})
    }

    res.json({
      status:true,
      code:200,
      data:req.cate,
      message:'Category Edit Data'
    })
  }


  static async categoryUpdate(req,res,next){
    const errors = validationResult(req);
    if(!errors.isEmpty()){
       
      return res.status(422).json({error:errors.array()[0].msg})
    }
    
     const dataup = {
       name:req.body.name
     }

     try{
      const cate_id = req.cate._id;
       const upData =await Category.findOneAndUpdate({'_id':cate_id},dataup,{new:true});
        if(upData){
            res.json({
              status:true,
              code:200,
              message:'Category Data update'
            })
        }else{
          res.json({
              status:false,
              code:422,
              message:'Category data not Update'
          })
        }
     }catch(err){
         next(err)
     }

  }

  static async categoryDelete(req,res,next){

    const errors = validationResult(req);
    if(!errors.isEmpty()){
       return res.status(200).json({
          error:errors.array()[0].msg
       })
    }


    try{
       const cate_id = req.cate.cate_id;
       Category.findByIdAndDelete(cate_id, function (err, docs) { 
        if (err){ 
          res.json({
                 status:false,
                 code:422,
                 message:err
               })
        } 
        else{ 
                res.json({
          status:true,
            code:200,
            message:'User Delete Successfully'
          })
        } 
    }); 

    }catch(err){
      next(err);
    }

  }


  static async keyjobs(req,res,next){
    //HTML 5, css, ajax, php, Wordpress, laravel, codeigniter;
     const key = req.body.key;
     const location = req.body.location;
     //console.log(key)
    try{
      const docs = await jobs.find({'skills':key,'location':location });
    // const docs = await jobs.aggregate([{ $match: { 'skills': key } }]);
      res.send(docs);
     
    }catch(err){
      next(err)
    }
  }







}