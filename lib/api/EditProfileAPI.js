import Router from 'router';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

import config from '../config/index.js';
import { apiPrivateWrapper } from '../utils/apiWrapper.js';
import { getTokenData } from '../utils/functions.js';
import EditProfileAction from '../actions/EditProfile.js';

//initialize router
const editProfileApi = Router();

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    console.log('===file', file);
    try {
      //for now we accept only images
      if (!file.originalname.match(/\.(jpeg|jpg|png)$/i)) {
        return cb(JSON.stringify({ photo: 'Invalid file extension.' }), null);
      }

      const { id } = await getTokenData(req);

      const user = await EditProfileAction.get(id);

      const fieldType = file.fieldname;

      const oldFilePath = user[fieldType]
        ? path.join(process.cwd(), user[fieldType])
        : null;

      const filePath = path.join(config.avatarFolder, id.toString());
      console.log('===FILE PATH', filePath);
      const fullFilePath = path.join(process.cwd(), filePath);
      console.log('===fullFilePath', fullFilePath);

      req.body[file.fieldname] = `${filePath}/${file.originalname}`;
      console.log('==MULTER CONSOLE LOG', req.photo);

      console.log('==userFolder', fullFilePath);

      if (!fs.existsSync(fullFilePath)) {
        fs.mkdirSync(fullFilePath);
      }
      req.body[file.fieldname] = `${filePath}/${file.originalname}`;

      if (oldFilePath && fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
    }

      cb(null, fullFilePath);
    } catch (error) {
      console.log('===MULTER ERROR', error);
    }
  },
  filename: function (req, file, cb) {
    //set up file name
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const uploadFields = upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'logo', maxCount: 1 }
]);

// Функция для обновления профиля
async function updateProfile(req, res) {
  try {
      const { id } = await getTokenData(req);
      const user = await EditProfileAction.get(id);

      // Если значение photo или logo пустое, удаляем старый файл
      ['photo', 'logo'].forEach((field) => {
          if (!req.body[field] && user[field]) {
              const oldFilePath = path.join(process.cwd(), user[field]);
              if (fs.existsSync(oldFilePath)) {
                  fs.unlinkSync(oldFilePath);
              }
          }
      });

      // Обновляем профиль пользователя с новыми данными
      await EditProfileAction.update({ id, ...req.body });

      res.json({ success: true });
  } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
}

// Маршрут для обновления профиля с использованием apiPrivateWrapper
editProfileApi.route('/api/v1/edit-profile/update').put(uploadFields, apiPrivateWrapper(async (req, res) => {
  await updateProfile(req, res);
}));

// маршрут для получения данных
editProfileApi.route('/api/v1/profile/get').get(
  apiPrivateWrapper(async (req, res) => {
    const result = await EditProfileAction.get(req.userId);
    console.log('Get Works', req.userId);
    return result;
  }),
);

export default editProfileApi;
