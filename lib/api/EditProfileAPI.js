import Router from 'router';
import multer from 'multer';
import path from 'path';

import config from '../config/index.js';
import { apiPrivateWrapper } from '../utils/apiWrapper.js'
import EditProfileAction from '../actions/EditProfile.js';

//initialize router
const editProfileApi = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      //for now we accept only images
      if (!file.originalname.match(/\.(jpeg|jpg|png)$/i)) {
        return cb(JSON.stringify({ 'photo': 'Invalid file extension.' }), null);
      }
      console.log('===path.join(process.cwd(), config.avatarFolder)', path.join(process.cwd(), config.avatarFolder))
      cb(null, path.join(process.cwd(), config.avatarFolder))
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
  console.log('===UPDATE', req.body);
  console.log('===UPDATE FILE', req.body);
  const userData = {
    ...req.body,
    id: req.userId,
  };

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
