import { match, rejects } from "assert";
import * as bcrypt from 'bcrypt';
import * as multer   from 'multer';

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/uploads')
  },
  filename: function (req, file, cb) {
      if(file){
        cb(null, file.originalname)
      }else{
        cb(new Error('file is empty'),false)
      }
   
  }
})

const fileFlter = (req,file,cb) =>{
 // console.log(file.mimetype);
    
      if(file.mimetype==='image/jpg' || file.mimetype == 'image/png'){
        cb(null, true)
       }else{
        cb(new Error('file extension not correct'),false)
       }
    
  
}
 


export class Utils{
    public MAX_TOKEN_TIME = 6000;
    public multer = multer({ storage: storage , fileFilter: fileFlter })
    static generatedverificationToken(size:number=5){
       let digits = '123456789';
       let otp = '';

       for(let i =0;i<size;i++){
      
       otp += digits[Math.floor(Math.random()*10)];
       }

       return parseInt(otp);

    }

    static  encryptPassword(password:string):Promise<any>{

        return new Promise((resolve,reject)=>{
            bcrypt.hash(password, 12, function(err, hash) {
    
              if(err){
                reject(err);
              }else{
                resolve(hash);
              }
              
          })
          })

    }

  














}