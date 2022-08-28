const nodemailer = require("nodemailer");


const mailHelper = async (options) => {
    const  transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        // secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER, // generated ethereal user
          pass: process.env.SMTP_PASSWORD, // generated ethereal password
        },
      });

      const messageProperty = {
        from: 'avinash@ecom.com', // sender address
        to: options.toEmail, // list of receivers
        subject: options.subject, // Subject line
        text: options.message, // plain text body
        // html: "<b>Hello world?</b>", // html body
      }
        // send mail with defined transport object
    await transporter.sendMail(messageProperty);
}


module.exports = mailHelper;