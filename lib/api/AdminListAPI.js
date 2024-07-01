import Router from 'router';
import AdminListAction from '../actions/AdminList.js';

//initialize router
const adminListApi = Router();

adminListApi.route('/api/v1/admin-list/add').post(async (req, res) => {
  try {
    const result = await AdminListAction.add(req.body);
    console.log('Add Works', req.body);
    const adminListData = {
      ...req.body,                           // данные отправленные на сревер ...req.body
      id: result.insertId,
    };
    res.end(JSON.stringify(adminListData));
  } catch (e) {
    console.log('Error adding data', e);
  }
});

adminListApi.route('/api/v1/admin-list/addSkill').post(async (req, res) => {
  try {
    const result = await AdminListAction.addSkill(req.body);
    console.log('Add Works', req.body);
    const adminListData = {
      ...req.body,                           // данные отправленные на сревер ...req.body
      id: result.insertId,
    };
    res.end(JSON.stringify(adminListData));
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
    res.end(JSON.stringify(result));
  } catch (e) {
    console.log('Error getting all data', e);
  }
});


// маршрут для удаления данных
adminListApi.route('/api/v1/admin-list/deleteById/:id').delete(async (req, res) => {
  try {
    const result = await AdminListAction.deleteById(req.params.id);
    console.log('Delete Works', req.params.id);
    res.end(JSON.stringify(result));
  } catch (e) {
    console.log('Error deleting data', e);
  }
});


// обновление данных
  adminListApi.route('/api/v1/admin-list/update/:id').put(async (req, res) => {
    try {
      const result = await AdminListAction.update(req.body);
      res.end(JSON.stringify(req.body));
    } catch (e) {
      console.log('Error updating data', e);
    }
  });

  adminListApi.route('/api/v1/admin-list/deleteAll').delete(async (req, res) => {
    try {
      const result = await AdminListAction.deleteAll();
      console.log('Deleted all data');
      res.end(JSON.stringify(result)); // Возвращаем подтверждение удаления (result - статистика)
    } catch (e) {
      console.log('Error deleting all data', e);
    }
  });

export default adminListApi;
