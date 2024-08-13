import { fileURLToPath } from 'url';
import path from 'path';
import jwt from 'jsonwebtoken';


const trimString = (string) => {
  string = string.replace(/\n/g, '');
  return string.replace(/ +/g, ' ').trim();
};

const getDirName = (url) => {
  const __filename = fileURLToPath(url);
  return path.dirname(__filename);
};

const getTokenData = (req) => {
  let token = req.headers['x-solt'];
  return jwt.verify(token, process.env.SECRET);
};

export {
  trimString,
  getDirName,
  getTokenData,
};

