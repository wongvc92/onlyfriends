import dotenv from "dotenv";
dotenv.config({ path: "./server/.env" });

export const getEnv = (key: string): string => {
  const value = process.env[key];
  if (value === undefined) {
    throw new Error(`Enviroment variable ${key} is not set`);
  }
  return value;
};
