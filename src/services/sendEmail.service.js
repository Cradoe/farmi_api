import nodemailer from 'nodemailer';
import dotenv from "dotenv";


dotenv.config();


const transport = {
    //this is the authentication for sending email.
    service: process.env.GMAIL_SERVICE_NAME,
    host: process.env.GMAIL_SERVICE_HOST,
    port: process.env.GMAIL_SERVICE_PORT,
    secure: process.env.GMAIL_SERVICE_SECURE, // use TLS
    auth: {
        user: process.env.GMAIL_USER_NAME,
        pass: process.env.GMAIL_USER_PASSWORD,
    },
}

const transporter = nodemailer.createTransport( transport );

transporter.verify( ( error, success ) => {
    if ( error ) {
        //if error happened code ends here
        console.error( error )
    }
} );


export const sendEmail = async ( { subject, body, to }, callback = () => { } ) => {
    try {

        const mail = {
            to,
            subject,
            text: body,
            from: process.env.GMAIL_USER_NAME
        }

        await transporter.sendMail( mail, callback );

    } catch ( error ) {
        console.log( error );
    }
}

