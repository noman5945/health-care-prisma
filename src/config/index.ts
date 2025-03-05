import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  jwt: {
    jwt_secret: process.env.JWT_SECRET,
    access_token: process.env.ACCESS_TOKEN_SECRET,
    expires_in: process.env.EXPIRES_IN,
    refresh_token: process.env.REFRESH_TOKEN_SECRET,
    refresh_token_expires_in: process.env.REFRESH_TOKEN_EXPIRES_IN,
    forgot_pass_token: process.env.FORGOT_PASS_TOKEN_SECRET,
    forgot_pass_expires_in: process.env.FORGOT_PASS_EXPIRES_IN,
  },
  reset_pass_base_link: process.env.RESET_PASS_BASE_LINK,
  nodemailer: {
    nodemailer_pass: process.env.NODEMAIL_PASS,
    nodemailer_email: process.env.NODEMAIL_EMAIL,
  },
};
