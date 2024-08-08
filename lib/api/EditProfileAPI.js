import Router from 'router';
import EditProfileAction from '../actions/EditProfile.js';

//initialize router
const editProfileApi = Router();

editProfileApi.route('/api/v1/edit-profile/add').post(async (req, res) => {
  try {
    const result = await EditProfileAction.add(req.body);
    console.log('Add Works', req.body);
    const userData = {
      ...req.body, 
      id: result.insertId,
    };
    res.end(JSON.stringify(userData));
  } catch (e) {
    console.log('Error adding data', e);
  }
});

// маршрут для получения данных
editProfileApi.route('/api/v1/edit-profile/get/:id').get(async (req, res) => {
  try {
    const result = await EditProfileAction.get(req.params.id);
    console.log('Get Works', req.params.id);
    res.end(JSON.stringify(result));
  } catch (e) {
    console.log('Error getting data', e);
  }
});


export default editProfileApi;
