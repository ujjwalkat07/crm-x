import bcrypt from "bcrypt";

export const comparePassword = async (password: string, hashpassword: string) =>
  bcrypt.compare(password, hashpassword).catch(() => false);

export const hashPassword = async (HashPassword: string, SaltRound: number) =>
  bcrypt.hash(HashPassword, SaltRound || 10);
