import Router from 'router';
import url from 'url';

import BackAdminListAction from '../actions/BackAdminList.js';

//initialize router
const backAdminListApi = Router();

backAdminListApi.route('/api/v1/back-admin-list/add').post(async (req, res) => {
  try {
    const result = await BackAdminListAction.add(req.body);
    console.log('Add Works', req.body);
    const adminListData = {
      ...req.body, // данные отправленные на сревер ...req.body
      id: result.insertId,
    };
    res.end(JSON.stringify(adminListData));
  } catch (e) {
    console.log('Error adding data', e);
  }
});

backAdminListApi
  .route('/api/v1/back-admin-list/addSkill')
  .post(async (req, res) => {
    try {
      const result = await BackAdminListAction.addSkill(req.body);
      console.log('Add Works', req.body);
      const adminListData = {
        ...req.body, // данные отправленные на сревер ...req.body
        skill_id: result.insertId,
      };
      res.end(JSON.stringify(adminListData));
    } catch (e) {
      console.log('Error adding data', e);
    }
  });

// маршрут для получения данных
backAdminListApi
  .route('/api/v1/back-admin-list/get/:id')
  .get(async (req, res) => {
    try {
      const result = await BackAdminListAction.get(req.params.id);
      console.log('Get Works', req.params.id);
      res.end(JSON.stringify(result));
    } catch (e) {
      console.log('Error getting data', e);
    }
  });

// маршрут для получения всех данных
backAdminListApi
  .route('/api/v1/back-admin-list/getAll')
  .get(async (req, res) => {
    try {
      const { query: { start, limit, search, filter_by } } = url.parse(req.url, true);

      const result = await BackAdminListAction.getAll(+start, +limit, search, filter_by);
      res.end(JSON.stringify(result));
    } catch (e) {
      console.log('Error getting all data', e);

      // res.status(500).end();
    }
  });

// маршрут для удаления данных
backAdminListApi
  .route('/api/v1/back-admin-list/deleteById/:id')
  .delete(async (req, res) => {
    try {
      await BackAdminListAction.deleteById(req.params.id);
      console.log('Delete Works', req.params.id);
      res.end('Success');
    } catch (e) {
      console.log('Error deleting data', e);
    }
  });
backAdminListApi
  .route('/api/v1/back-admin-list/deleteSkillById/:id')
  .delete(async (req, res) => {
    try {
      await BackAdminListAction.deleteSkillById(req.params.id);
      console.log('Delete Works', req.params.id);
      res.end('Success');
    } catch (e) {
      console.log('Error deleting data', e);
    }
  });

// обновление данных
backAdminListApi
  .route('/api/v1/back-admin-list/update/:id')
  .put(async (req, res) => {
    try {
      const result = await BackAdminListAction.update(req.body);
      res.end(JSON.stringify(req.body));
    } catch (e) {
      console.log('Error updating data', e);
    }
  });

backAdminListApi
  .route('/api/v1/back-admin-list/update-skill/:id')
  .put(async (req, res) => {
    try {
      const result = await BackAdminListAction.updateSkill(req.body);
      res.end(JSON.stringify(req.body));
    } catch (e) {
      console.log('Error updating data', e);
    }
  });

backAdminListApi
  .route('/api/v1/back-admin-list/deleteAll')
  .delete(async (req, res) => {
    try {
      const result = await BackAdminListAction.deleteAll();
      console.log('Deleted all data');
      res.end(JSON.stringify(result)); // Возвращаем подтверждение удаления (result - статистика)
    } catch (e) {
      console.log('Error deleting all data', e);
    }
  });

export default backAdminListApi;
