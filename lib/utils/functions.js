import { fileURLToPath } from 'url';
import path from 'path';
import jwt from 'jsonwebtoken';
import _ from 'lodash';

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

const placeDataByPath = (data) => {
  let placedData = {};
  _.forEach(data, (value, field) => {
    _.set(placedData, field, value);
  });

  return placedData;
};

export {
  trimString,
  getDirName,
  getTokenData,
  placeDataByPath,
};

