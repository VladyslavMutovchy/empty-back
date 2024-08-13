import Router from 'router';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

import config from '../config/index.js';
import { apiPrivateWrapper } from '../utils/apiWrapper.js'
import { getTokenData  } from '../utils/functions.js';
import EditProfileAction from '../actions/EditProfile.js';

//initialize router
const editProfileApi = Router();

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    try {
      //for now we accept only images
      if (!file.originalname.match(/\.(jpeg|jpg|png)$/i)) {
        return cb(JSON.stringify({ 'photo': 'Invalid file extension.' }), null);
      }

      const { id } = await getTokenData(req);

      const filePath = path.join(config.avatarFolder, id.toString());
      console.log('===FILE PATH', filePath);
      const fullFilePath = path.join(process.cwd(), filePath);
      console.log('===fullFilePath', fullFilePath);

      req.photo = `${filePath}/${file.originalname}`;
      console.log('==MULTER CONSOLE LOG', req.photo)

      console.log('==userFolder', fullFilePath);

      if (!fs.existsSync(fullFilePath)) {
        fs.mkdirSync(fullFilePath);
      }

      cb(null, fullFilePath);
    } catch (error) {
      console.log('===MULTER ERROR', error)
    }
  },
  filename: function (req, file, cb) {
    //set up file name
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

editProfileApi.route('/api/v1/edit-profile/update').put(upload.single('photo'), apiPrivateWrapper(async (req, res) => {
  console.log('===req.photo', req.photo);
  console.log('===UPDATE FILE', req.body);
  const userData = {
    ...req.body,
    photo: req.photo,
    id: req.userId,
  };

  console.log('===userData', userData)

  const result = await EditProfileAction.update(userData);
  console.log('Add Works', req.body);
  return userData;
}));

// маршрут для получения данных
editProfileApi.route('/api/v1/profile/get').get(apiPrivateWrapper(async (req, res) => {
  const result = await EditProfileAction.get(req.userId);
  console.log('Get Works', req.userId);
  return result;
}));


export default editProfileApi;
