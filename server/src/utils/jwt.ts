import jwt from "jsonwebtoken";

interface SignTokenProps {
  jwtInfo: { [key: string]: string | null };
  jwtSecret: string;
  expiresIn: string;
}
const signToken = ({ jwtInfo, jwtSecret, expiresIn }: SignTokenProps): string => {
  return jwt.sign(
    jwtInfo,
    jwtSecret,
    { expiresIn } // 15 minutes
  );
};

interface DecodeTokenProps {
  requestToken: string;
  tokenSecret: string;
}

const decodeToken = ({ requestToken, tokenSecret }: DecodeTokenProps) => {
  return jwt.verify(requestToken, tokenSecret);
};
export const jwtUtils = {
  signToken,
  decodeToken,
};
