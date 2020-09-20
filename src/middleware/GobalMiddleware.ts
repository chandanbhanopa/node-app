import * as jwt from 'jsonwebtoken';
import { decode } from 'querystring';

export class GobalMiddleware{

    static async authonticate(req,res,next){
        const authHeader = req.headers.authorization;
        const token = authHeader ? authHeader.slice(7,authHeader.length):null;
        try{
         req.errorStatus = 401;
         jwt.verify(token, 'secret', function(err, decoded) {
            if(err){
                next(err)
            }else if(!decoded){
                 next(new Error('User Not Authorised'))
            }else{
                req.user=decoded;
                next()
            }
          });
           
        }catch(err){
            next(err);
        }
    }
}