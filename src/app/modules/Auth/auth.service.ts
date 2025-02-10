import { Prisma, PrismaClient } from "@prisma/client";
import { AuthUtils } from "../../utils/authUtils";

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
  const accessToken = AuthUtils.genarateAccessToken(payload);
  const refreshToken = AuthUtils.genarateRefreshToken(payload);

  return {
    accessToken,
    refreshToken,
    needPassChange: user.needPasswordChange,
  };
};

export const AuthServices = {
  loginUser,
};
