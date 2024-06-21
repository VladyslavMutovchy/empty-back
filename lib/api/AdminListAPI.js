import Router from 'router';
import AdminListAction from '../actions/AdminList.js';

//initialize router
const adminListApi = Router();

adminListApi.route('/api/v1/admin-list/add').post(async (req, res) => {
  try {
    const result = await AdminListAction.add(req.body);
    console.log('Add Works', req.body);
    res.end(JSON.stringify(result));
  } catch (e) {
    console.log('Error adding data', e);
  }
});

// маршрут для получения данных
adminListApi.route('/api/v1/admin-list/get/:id').get(async (req, res) => {
  try {
    const result = await AdminListAction.get(req.params.id);
    console.log('Get Works', req.params.id);
    res.end(JSON.stringify(result));
  } catch (e) {
    console.log('Error getting data', e);
  }
});

// маршрут для получения всех данных
adminListApi.route('/api/v1/admin-list/getAll').get(async (req, res) => {
  try {
    const result = await AdminListAction.getAll();
    console.log('ROUTE:Fetched all data:', result); // Log the result
    res.end(JSON.stringify(result));
  } catch (e) {
    console.log('Error getting all data', e);
  }
});
// маршрут для удаления данных
adminListApi.route('/admin-list/deleteById/:id').delete(async (req, res) => {
  try {
    const result = await AdminListAction.deleteById(req.params.id);
    console.log('Delete Works', req.params.id);
    res.end(JSON.stringify(result));
  } catch (e) {
    console.log('Error deleting data', e);
    res.status(500).end('Error deleting data');
  }
});

export default adminListApi;
