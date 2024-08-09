import Router from 'router';

import { apiPrivateWrapper } from '../utils/apiWrapper.js'
import EditProfileAction from '../actions/EditProfile.js';

//initialize router
const editProfileApi = Router();

editProfileApi.route('/api/v1/edit-profile/add').post(apiPrivateWrapper(async (req, res) => {
  const userData = {
    ...req.body,
    id: req.userId,
  };

  const result = await EditProfileAction.upadte(userData);
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
