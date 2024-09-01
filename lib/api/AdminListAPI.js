import Router from 'router';
import AdminListAction from '../actions/AdminList.js';

//initialize router
const adminListApi = Router();

adminListApi.route('/api/v1/admin-list/add').post(async (req, res) => {
  try {
    const result = await AdminListAction.addMongoDB(req.body);
    console.log('Add Works', req.body);
    const adminListData = {
      ...req.body, // данные отправленные на сревер ...req.body
      id: result.insertedId,
    };
    res.end(JSON.stringify(adminListData));
  } catch (e) {
    console.log('Error adding data', e);
  }
});

adminListApi.route('/api/v1/admin-list/addSkill').post(async (req, res) => {
  try {
    // const body
    const result = await AdminListAction.addSkillMongoDB(req.body);
    console.log('Add Works', req.body);
    const adminListData = {
      ...req.body, // данные отправленные на сревер ...req.body
      skill_id: result.insertedId,
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
adminListApi
  .route('/api/v1/admin-list/deleteById/:id')
  .delete(async (req, res) => {
    try {
      await AdminListAction.deleteById(req.params.id);
      console.log('Delete Works', req.params.id);
      res.end('Success');
    } catch (e) {
      console.log('Error deleting data', e);
    }
  });
adminListApi
  .route('/api/v1/admin-list/deleteSkillById/:id')
  .delete(async (req, res) => {
    try {
      await AdminListAction.deleteSkillById(req.params.id);
      console.log('Delete Works', req.params.id);
      res.end('Success');
    } catch (e) {
      console.log('Error deleting data', e);
    }
  });

// обновление данных
adminListApi.route('/api/v1/admin-list/update/:id').put(async (req, res) => {
  try {
    const adminListData = { 
      age: req.body.age,
      name: req.body.name,
    } ;

    const result = await AdminListAction.updateMongoDB(req.body.id, adminListData);
    res.end(JSON.stringify(req.body));
  } catch (e) {
    console.log('Error updating data', e);
  }
});

adminListApi.route('/api/v1/admin-list/update-skill/:id').put(async (req, res) => {
  try {

    console.log('===req.body', req.body);

    const skillData = {
      skill: req.body.skill,
    };

    const result = await AdminListAction.updateSkillMongoDB(req.body.skill_id, skillData);
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
