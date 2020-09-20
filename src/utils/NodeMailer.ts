import * as nodeMailer from 'nodemailer';
//import * as sgTransport from 'nodemailer-sendgrid-transport';
var sgTransport = require('nodemailer-sendgrid-transport');
export class NodeMailer{
  private static initializeTransport(){
      return nodeMailer.createTransport(sgTransport({
        auth: {
            api_key: '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'
        }
      }))
  }

  static sendEmail(data:{to:string[],subject:string,html:string}):Promise<any>{
     return NodeMailer.initializeTransport()
      .sendMail({
          from :'ranjeetvit@gmail.com',
          to:data.to,
          subject:data.subject,
          html:data.html
      })
  }
}