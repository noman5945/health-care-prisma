import * as bcrypt from "bcrypt";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
const checkPassword = async (givenPass: string, encryptedPass: string) => {
  return await bcrypt.compare(givenPass, encryptedPass);
};

const genarateAccessToken = (payload: { email: string; password: string }) => {
  return jwt.sign(payload, "gfdgdfgdg", {
    algorithm: "HS256",
    expiresIn: "15m",
  });
};
const genarateRefreshToken = (payload: { email: string; password: string }) => {
  return jwt.sign(payload, "gfdgdfgdghi", {
    algorithm: "HS256",
    expiresIn: "30d",
  });
};

const verifyToken = (token: string, secret: Secret) => {
  return jwt.verify(token, secret) as JwtPayload;
};

export const AuthUtils = {
  checkPassword,
  genarateAccessToken,
  genarateRefreshToken,
  verifyToken,
};
