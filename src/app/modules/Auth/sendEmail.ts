import nodemailer from "nodemailer";
import config from "../../../config";

const emailSender = async (receiverEmail: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: config.nodemailer.nodemailer_email,
      pass: config.nodemailer.nodemailer_pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Healthcare Admin" <abdullahnoman.5945@gmail.com>', // sender address
    to: receiverEmail, // list of receivers
    subject: "Reset Password", // Subject line
    //text: "Hello world?", // plain text body
    html, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
};

export default emailSender;
