import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import config from "config";

import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const JWT_SECRET = config.get("JWT_SECRET") as string;

const prisma = new PrismaClient();

type UserData = {
  id: number;
  fullName: string;
  email: string;
  role: string;
};

const signToken = (id: number) => {
  return jwt.sign({ id }, JWT_SECRET);
};

const createToken = async (id: number, user: UserData, res: Response) => {
  const token = signToken(id as number);
  const cookieOptions = {
    httpOnly: true,
  };

  res.cookie("jwt", token, cookieOptions);

  res.status(200).json({
    status: "success",
    user,
    token,
  });
};

export const getAllAdmin = async (req: Request, res: Response) => {
  const allAdmin = await prisma.user.findMany({
    where: {
      role: "ADMIN",
    },
  });

  res.status(200).json({
    status: "success",
    totalAdmins: allAdmin.length,
    admins: allAdmin,
  });
};

export const signUp = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(400).json({
        status: "error",
        msg: "User not found",
      });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      const newAdmin = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          fullName: name,
          role: "ADMIN",
        },
        select: { id: true, fullName: true, email: true, role: true },
      });

      await createToken(newAdmin.id, newAdmin, res);
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      msg: "Something went wrong",
    });
  }
};

export const signIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (
      !existingUser ||
      !(await bcrypt.compare(password, existingUser.password))
    ) {
      res.status(400).json({
        status: "error",
        msg: "Invalid email or password",
      });
    } else {
      await createToken(existingUser.id, existingUser, res);
    }
  } catch (e) {
    res.status(500).json({
      status: "error",
      msg: "Something went wrong",
    });
  }
};
