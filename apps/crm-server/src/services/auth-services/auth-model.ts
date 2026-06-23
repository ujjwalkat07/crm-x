import { prisma } from "../../lib/prisma";
import {
  accessTokenJwtSign,
  refreshTokenJwtSign,
  hashPassword,
  comparePassword,
} from "../../utils/utils-export";

export interface AuthDocument {
  id: string;
  fullName: string;
  email: string;
  password: string;
  refreshToken: string | null;
  createdAt: Date;
  updatedAt: Date;
  GenrateAccessToken(): string;
  GenrateRefreshToken(): string;
  IsPasswordCorrect(password: string): Promise<boolean>;
}

export interface PublicAuthUser {
  id: string;
  fullName: string;
  fullname: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

interface UserRecord {
  id: string;
  fullName: string;
  email: string;
  password: string;
  refreshToken: string | null;
  createdAt: Date;
  updatedAt: Date;
};

const toAuthDocument = (user: UserRecord): AuthDocument => ({
  id: user.id,
  fullName: user.fullName,
  email: user.email,
  password: user.password,
  refreshToken: user.refreshToken,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
  GenrateAccessToken() {
    return accessTokenJwtSign({
      id: user.id,
      email: user.email,
      fullname: user.fullName,
    });
  },
  GenrateRefreshToken() {
    return refreshTokenJwtSign({
      id: user.id,
    });
  },
  IsPasswordCorrect(password: string) {
    return comparePassword(password, user.password);
  },
});

export const sanitizeAuthUser = (
  user: UserRecord | AuthDocument | PublicAuthUser,
): PublicAuthUser => ({
  id: user.id,
  fullName: user.fullName,
  fullname: user.fullName,
  email: user.email,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export class Auth {
  static async findOne(where: { email: string }) {
    const user = await prisma.user.findUnique({
      where: { email: where.email.toLowerCase() },
    });
    return user ? toAuthDocument(user) : null;
  }

  static async create(data: {
    fullName: string;
    email: string;
    password: string;
  }) {
    const hashedPassword = await hashPassword(data.password, 10);
    const user = await prisma.user.create({
      data: {
        fullName: data.fullName,
        email: data.email.toLowerCase(),
        password: hashedPassword,
      },
    });

    return toAuthDocument(user);
  }

  static async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    return user ? toAuthDocument(user) : null;
  }

  static async findPublicById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      omit: {
        password: true,
        refreshToken: true,
      },
    });

    return user
      ? {
        id: user.id,
        fullName: user.fullName,
        fullname: user.fullName,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }
      : null;
  }

  static async updateRefreshToken(id: string, refreshToken: string) {
    const user = await prisma.user.update({
      where: { id },
      data: { refreshToken },
    });

    return toAuthDocument(user);
  }

  static async clearRefreshToken(id: string) {
    const user = await prisma.user.update({
      where: { id },
      data: { refreshToken: null },
    });

    return toAuthDocument(user);
  }

  static async updateProfile(
    id: string,
    data: { fullName?: string; email?: string; password?: string }
  ) {
    const updateData: any = {};
    if (data.fullName !== undefined) {
      updateData.fullName = data.fullName;
    }
    if (data.email !== undefined) {
      updateData.email = data.email.toLowerCase();
    }
    if (data.password !== undefined) {
      updateData.password = await hashPassword(data.password, 10);
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    return toAuthDocument(user);
  }
}

