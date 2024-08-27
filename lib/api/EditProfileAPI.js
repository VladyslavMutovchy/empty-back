import Router from 'router';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import _ from 'lodash';

import config from '../config/index.js';
import { apiPrivateWrapper } from '../utils/apiWrapper.js';
import { getTokenData } from '../utils/functions.js';
import EditProfileAction from '../actions/EditProfile.js';

//initialize router
const editProfileApi = Router();

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    try {
      const { id } = await getTokenData(req); // Получаем ID пользователя
      let filePath;
  
      // Проверяем, является ли файл наградой
      if (file.fieldname.includes('award')) {
        filePath = path.join(config.avatarFolder, id.toString(), 'awards');
      } else {
        // Иначе сохраняем в папку пользователя
        filePath = path.join(config.avatarFolder, id.toString());
      }
  
      console.log('===FILE PATH', filePath);
      const fullFilePath = path.join(process.cwd(), filePath);
      console.log('===fullFilePath', fullFilePath);
  
      // Создаем папку, если она не существует
      if (!fs.existsSync(fullFilePath)) {
        fs.mkdirSync(fullFilePath, { recursive: true });
      }
  
      // Устанавливаем путь файла в req.body для сохранения в базе данных
      req.body[file.fieldname] = `${filePath}/${file.originalname}`;
  
      cb(null, fullFilePath);
    } catch (error) {
      console.log('===MULTER ERROR', error);
      cb(error, null);
    }
  },
  
  
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Устанавливаем имя файла
  },
});

const upload = multer({ storage: storage });

const uploadFields = upload.any();

// Функция для обновления профиля
async function updateProfile(body, userId) {
  const user = await EditProfileAction.get(userId);

  // Проверяем, пуст ли массив наград
  const awards = body.awards || [];
  if (_.isEmpty(awards)) {
    const awardsDir = path.join(process.cwd(), config.avatarFolder, userId.toString(), 'awards');
    if (fs.existsSync(awardsDir)) {
      fs.readdirSync(awardsDir).forEach(file => {
        const fileDir = path.join(awardsDir, file);
        if (fs.lstatSync(fileDir).isFile()) {
          fs.unlinkSync(fileDir); // Удаляем файл
        }
      });
    }
  }

  // Если значение photo или logo пустое, удаляем старый файл
  ['photo', 'logo'].forEach(field => {
    if (!body[field] && user[field]) {
      const oldFilePath = path.join(process.cwd(), user[field]);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }
  });

  // Обновляем профиль пользователя с новыми данными
  await EditProfileAction.update({ id: userId, ...body });

  return { success: true };
}


// Маршрут для обновления профиля с использованием apiPrivateWrapper
editProfileApi.route('/api/v1/edit-profile/update').put(
  uploadFields,
  apiPrivateWrapper(async (req) => {
    let body = {};

    let awards = [];
    _.forEach(req.body, (value, field) => {
      if (field.startsWith('award[')) {
        const [, index, prop] = field.match(/award\[(\d+)\]\.(.+)/);
        if (!awards[index]) awards[index] = {};
        awards[index][prop] = value;
        return;
      }
      _.set(body, field, value);
    });

    body.awards = awards;

    console.log('===BODY', body);

    return await updateProfile(body, req.userId);
  }),
);

// маршрут для получения данных
editProfileApi.route('/api/v1/profile/get').get(
  apiPrivateWrapper(async (req, res) => {
    const result = await EditProfileAction.get(req.userId);
    console.log('Get Works', req.userId);
    return result;
  }),
);

export default editProfileApi;
