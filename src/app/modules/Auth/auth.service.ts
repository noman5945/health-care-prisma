import { Prisma, PrismaClient, UserStatus } from "@prisma/client";
import { AuthUtils } from "../../utils/authUtils";
import config from "../../../config";
import { Secret } from "jsonwebtoken";
import { utilFunctions } from "../../utils/utils";

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
  return UserExists;
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

export const AuthServices = {
  loginUser,
  getNewaccessToken,
  changePassword,
};
