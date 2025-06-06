import { Prisma, PrismaClient, UserStatus } from "@prisma/client";
import { AuthUtils } from "../../utils/authUtils";
import config from "../../../config";
import { Secret } from "jsonwebtoken";
import { utilFunctions } from "../../utils/utils";
import emailSender from "./sendEmail";
import ApiError from "../../errors/ApiError";
import { StatusCodes } from "http-status-codes";

const prisma = new PrismaClient();
const loginUser = async (payload: { email: string; password: string }) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { email: payload.email },
  });
  const correctPassword = await AuthUtils.checkPassword(
    payload.password,
    user.password
  );
  if (!correctPassword) {
    throw new Error("Incorrect Password!");
  }
  const UserInfo = {
    email: payload.email,
    role: user.role,
  };
  const accessToken = AuthUtils.genarateAccessToken(UserInfo);
  const refreshToken = AuthUtils.genarateRefreshToken(UserInfo);

  return {
    accessToken,
    refreshToken,
    needPassChange: user.needPasswordChange,
  };
};

const getNewaccessToken = async (token: string) => {
  let decoded;
  try {
    decoded = AuthUtils.verifyToken(token, config.jwt.refresh_token as Secret);
  } catch (error) {
    throw new Error("You are not authorized");
  }
  const UserExists = await prisma.user.findUniqueOrThrow({
    where: {
      email: decoded.email,
      status: UserStatus.ACTIVE,
    },
  });
  const UserInfo = {
    email: UserExists.email,
    role: UserExists.role,
  };
  const accessToken = AuthUtils.genarateAccessToken(UserInfo);

  return { accessToken };
};

const changePassword = async (
  user: any,
  oldPassword: string,
  newPassword: string
) => {
  const email = user.email;
  const currentUser = await prisma.user.findUniqueOrThrow({
    where: { email: email },
  });
  const correctPassword = await AuthUtils.checkPassword(
    oldPassword,
    currentUser.password
  );
  if (!correctPassword) {
    throw new Error("Incorrect old Password!");
  }
  const hashedPassword: string = await utilFunctions.encryptPassword(
    newPassword
  );
  const updated = await prisma.user.update({
    where: { email: email },
    data: { password: hashedPassword, needPasswordChange: false },
  });
  return updated;
};

const forgotPassword = async (payload: { email: string }) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { email: payload.email, status: UserStatus.ACTIVE },
  });
  const tokenData = {
    email: payload.email,
    role: user.role,
  };
  const expireTime: number = 300;
  const forgotPassToken = AuthUtils.generateToken(
    tokenData,
    config.jwt.forgot_pass_token as Secret,
    expireTime
  );
  const reset_link =
    config.reset_pass_base_link +
    "?" +
    `id=${user.id}&token=${forgotPassToken}`;
  emailSender(
    payload.email,
    `
      <div>
        <p>Click on this link to reset password: </p>
        <a href=${reset_link}>
          <button>Reset Link</button>
        </a>
      </div>
    `
  );
  return { forgotPassToken, reset_link };
};

const resetPassword = async (
  token: string,
  payload: { id: any; newPassword: any }
) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: payload.id, status: UserStatus.ACTIVE },
  });
  const veryfied = AuthUtils.verifyToken(
    token,
    config.jwt.forgot_pass_token as Secret
  );
  if (!veryfied) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized Acces");
  }
  const hashedPass = await utilFunctions.encryptPassword(payload.newPassword);
  const updateUserData = await prisma.user.update({
    where: { id: payload.id },
    data: {
      password: hashedPass,
    },
  });
  return updateUserData;
};

export const AuthServices = {
  loginUser,
  getNewaccessToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
