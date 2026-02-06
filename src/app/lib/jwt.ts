import jwt from "jsonwebtoken";
import "dotenv/config";
import { prisma } from "./client";

export const generateToken = (payload: object, expiresIn: any | undefined = "2h") => {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: expiresIn});
}

export const decodeToken = (token: string) => {
  return jwt.decode(token);
};

export const getUserByUsername = (username: string) => {
  const user = prisma.user.findFirst({
    where: {
      username: username
    }
  })
  return user;
}

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
};