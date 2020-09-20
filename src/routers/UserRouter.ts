import {Router} from 'express';
import {UserController} from '../controller/UserController';
import {UserValidators} from '../validators/UserValidators';
import {GobalMiddleware} from '../middleware/GobalMiddleware';
import { Utils } from '../utils/Utils';

 class UserRouter{
  public router: Router;

  constructor(){
      this.router = Router();
      this.getRouters();
      this.postRouter();
      this.patchRouter();
      this.deleteRouter();
  }

  getRouters(){
     this.router.get('/intervirew/allData',UserController.inteviewAllData);
     this.router.get('/emp/getjobsAllData',UserController.getjobsAllData);
     this.router.get('/jobs/allCategory',UserController.allCategory)
  }
     
  postRouter(){
    
    this.router.post('/login',UserValidators.loginUser(),UserController.login)
    this.router.post('/register',new Utils().multer.single('profile_pic'),UserController.register);
    this.router.post('/registerEdit',UserValidators.registerEdit(),UserController.registerEdit);
    this.router.post('/register/emp',UserValidators.registerEmploy(),UserController.registerEmp);
    this.router.post('/user/companyEdit',UserValidators.companyEdit(),UserController.companyEdit)
    this.router.post('/send/verification/email',
    GobalMiddleware.authonticate,
    UserController.resendVerificationEmail)
     this.router.post('/reset/password',UserValidators.resetPassword(),UserController.resetPassword);
     this.router.post('/verify/restPasswordToken',
     UserValidators.verifiyRestPassword(),
       UserController.verifiyRestPassword);
    this.router.post('/allUserData',UserController.userData);
    this.router.post('/emp/jobspost',UserValidators.jobsPost(),UserController.jobsPost);
    this.router.post('/emp/editJobPostData',UserController.editJobPostData);
    this.router.post('/user/applyJobs',UserValidators.applyJobs(),UserController.applyjobs)
    this.router.post('/user/allApplyuser',UserValidators.allApplyUser(),UserController.allApplyUser)
    this.router.post('/user/getAlluser',UserValidators.getAlluser(),UserController.getAlluser)
    this.router.post('/user/inteviewUser',UserValidators.inteviewUser(),UserController.inteviewUser)
    this.router.post('/search/locationBy',UserValidators.locationBy(),UserController.locationBy);
    this.router.post('/search/categoryby',UserValidators.categoryby(),UserController.categoryby);
    this.router.post('/search/typeby',UserValidators.typeby(),UserController.typeby);
    this.router.post('/search/industries',UserValidators.industries(),UserController.industries);
    this.router.post('/user/training',UserController.training);
    this.router.post('/jobs/category',UserValidators.category(),UserController.category);
    this.router.post('/jobs/categoryEdit',UserValidators.categoryEdit(),UserController.categoryEdit)
    this.router.post('/search/jobs',UserController.keyjobs)

    
  }

  patchRouter(){
    this.router.patch('/update/password',GobalMiddleware.authonticate,UserValidators.updatePassword(),UserController.passwordUpdate)
    this.router.patch('/reset/forUpdatePassword',UserValidators.forUpdatePassword(),UserController.forUpdatePassword);
    this.router.patch('/update/profilePic',
     new Utils().multer.single('profile_pic'),
     GobalMiddleware.authonticate,UserValidators.updateProfilePic(),UserController.updateProfilePic);
    this.router.patch('/emp/updateJobsDetails',UserValidators.updateJobsDetails(),UserController.updateJobsDetails);
    this.router.patch('/user/companyUpdate',UserValidators.companyUpdate(),UserController.companyUpdate);
    this.router.patch('/registerUpdate',UserValidators.registerUpdate(),UserController.registerUpdate);
    this.router.patch('/jobs/categoryUpdate',UserValidators.categoryUpdate(),UserController.categoryUpdate)
  }

  deleteRouter(){
    this.router.delete('/deleteUser',
    GobalMiddleware.authonticate,
    UserController.userDelete);
    this.router.delete('/emp/jobsDelete',UserController.jobsDelete);
    this.router.delete('/delete/applyjobsdelete',UserController.applyjobsdelete);
    this.router.delete('/user/`registerEmpDelete',UserValidators.registerEmpDelete(),UserController.registerEmpDelete);
    this.router.delete('/resgisterDelete',UserValidators.resgisterDelete(),UserController.resgisterDelete);
    //this.router.delete('/jobs/categoryDelete',UserValidators.categoryDelete(),UserController.categoryDelete)
  }
}

export default new UserRouter().router;