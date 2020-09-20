import * as express from 'express';
import * as mongoose from 'mongoose';
import UserRouter from './routers/userRouter';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import {getEnvironmentVariables} from './environment/env';

export class Server {

    public app:express.Application = express();

    constructor(){
        this.setConfigurations();
        this.setRouter();
        this.error404Handler();
        this.handleError();
    }

    setConfigurations(){
        this.setCors()
        this.setMongoose();
        this.configerBodyParser();

    }

    setCors(){
        const options: cors.CorsOptions = {
            allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'X-Access-Token', 'Authorization'],
            credentials: true,
            methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
            origin: '*',
            preflightContinue: false
        };
        this.app.use(cors(options));
    }
    setMongoose(){
        const database = getEnvironmentVariables().db_url;
        mongoose.connect(database,
         {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
            console.log("mongoose in connected")
        })
    }

    configerBodyParser(){
        
        this.app.use(bodyParser.urlencoded({ extended: false }))
        this.app.use(bodyParser.json());
       
      }

    setRouter(){
     this.app.use('/api/user',UserRouter);
    }

    error404Handler(){
        this.app.use((req,res)=>{
            res.status(404).json({
                message: 'Pages Not Found',
                status: '404'
            })
        })
    }

    handleError(){
        this.app.use((error,req,res,next)=>{
            const errorStatus = req.errorStatus || 500;
            res.status(errorStatus).json({
                message: error.message || 'Something Went Wrong Plz Try Again',
                status_code: errorStatus
                
            })
        })
    }

}