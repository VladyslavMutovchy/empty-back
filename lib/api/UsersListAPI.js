import Router from 'router';
import UserListAction from '../actions/UserList.js';

//initialize router
const userListApi = Router();

// маршрут для получения всех данных
userListApi.route('/api/v1/users/get-all').get(async (req, res) => {
  try {
    const result = await UserListAction.getAll();
    res.end(JSON.stringify(result));
  } catch (e) {
    console.log('Error getting all data', e);
  }
});

export default userListApi;
