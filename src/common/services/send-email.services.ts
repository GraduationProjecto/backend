/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common"
import * as nodemailer from 'nodemailer'

@Injectable()
export class SendEmailService {
    async sendEmail(
        {
            to='',
            subject='no-reply',
            message='<h1> no-message <h1/>',
            attachments=[]
        }
    ){
        const transporter = nodemailer.createTransport({
            host:'localhost', //smtp.gmail.com
            service:'gmail',
            port:465,
            secure:true,
            auth:{
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        })
        const info = await transporter.sendMail({
            from: `"Fred Foo 👻" <${process.env.EMAIL}>`,
            to,
            subject,
            html:message,
            attachments
        })
        return info.accepted.length ? true : false
    }
}