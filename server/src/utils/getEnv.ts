import dotenv from "dotenv";
dotenv.config();

export const getEnv = (key: string): string => {
  console.log(`Loading environment variable: ${key}`);
  console.log(`Value: ${process.env[key]}`);
  const value = process.env[key];
  if (value === undefined) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
};
