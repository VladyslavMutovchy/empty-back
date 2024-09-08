import Router from 'router';
import url from 'url';

import MongoAdminListAction from '../actions/MongoAdminList.js';

//initialize router
const mongoAdminListApi = Router();

mongoAdminListApi.route('/api/v1/mongo-admin-list/add').post(async (req, res) => {
  try {
    const result = await MongoAdminListAction.addMongoDB(req.body);
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

mongoAdminListApi
  .route('/api/v1/mongo-admin-list/addSkill')
  .post(async (req, res) => {
    try {
      const result = await MongoAdminListAction.addSkillMongoDB(req.body);
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
mongoAdminListApi
  .route('/api/v1/mongo-admin-list/get/:id')
  .get(async (req, res) => {
    try {
      const result = await MongoAdminListAction.get(req.params.id);
      console.log('Get Works', req.params.id);
      res.end(JSON.stringify(result));
    } catch (e) {
      console.log('Error getting data', e);
    }
  });

// маршрут для получения всех данных
mongoAdminListApi
  .route('/api/v1/mongo-admin-list/getAll')
  .get(async (req, res) => {
    try {
      const { query: { start, limit, search, filter_by, sort_by, sort_direction } } = url.parse(req.url, true);
      const result = await MongoAdminListAction.getAll(+start, +limit, search, filter_by, sort_by, sort_direction);
      res.end(JSON.stringify(result));
    } catch (e) {
      console.log('Error getting all data', e);

      // res.status(500).end();
    }
  });

// маршрут для удаления данных
mongoAdminListApi
  .route('/api/v1/mongo-admin-list/deleteById/:id')
  .delete(async (req, res) => {
    try {
      await MongoAdminListAction.deleteById(req.params.id);
      console.log('Delete Works', req.params.id);
      res.end('Success');
    } catch (e) {
      console.log('Error deleting data', e);
    }
  });
mongoAdminListApi
  .route('/api/v1/mongo-admin-list/deleteSkillById/:id')
  .delete(async (req, res) => {
    try {
      await MongoAdminListAction.deleteSkillById(req.params.id);
      console.log('Delete Works', req.params.id);
      res.end('Success');
    } catch (e) {
      console.log('Error deleting data', e);
    }
  });

// обновление данных
mongoAdminListApi.route('/api/v1/mongo-admin-list/update/:id').put(async (req, res) => {
  try {
    const adminListData = { 
      age: req.body.age,
      name: req.body.name,
    } ;

    const result = await MongoAdminListAction.updateMongoDB(req.body.id, adminListData);
    res.end(JSON.stringify(req.body));
  } catch (e) {
    console.log('Error updating data', e);
  }
});

mongoAdminListApi.route('/api/v1/mongo-admin-list/update-skill/:id').put(async (req, res) => {
  try {

    console.log('===req.body', req.body);

    const skillData = {
      skill: req.body.skill,
    };

    const result = await MongoAdminListAction.updateSkillMongoDB(req.body.skill_id, skillData);
    res.end(JSON.stringify(req.body));
  } catch (e) {
    console.log('Error updating data', e);
  }
});

mongoAdminListApi
  .route('/api/v1/mongo-admin-list/deleteAll')
  .delete(async (req, res) => {
    try {
      const result = await MongoAdminListAction.deleteAll();
      console.log('Deleted all data');
      res.end(JSON.stringify(result)); // Возвращаем подтверждение удаления (result - статистика)
    } catch (e) {
      console.log('Error deleting all data', e);
    }
  });

export default mongoAdminListApi;
