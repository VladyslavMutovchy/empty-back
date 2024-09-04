class AdminListAction {
  addMongoDB(data) {
    data.age = +data.age;
    return global.mongoConnection.insertOne('admin-list', data);
  }

  addSkillMongoDB(data) {
    return global.mongoConnection.insertOne('admin-list-skills', data);
  }

  async deleteSkillById(id) {
    console.log('Attempting to delete skill with ID:', id);
    return global.mongoConnection.deleteSkillById('admin-list-skills', id);
  }

  async deleteById(id) {
    console.log('Attempting to delete user with ID:', id);
    await global.mongoConnection.deleteById('admin-list', 'admin-list-skills', id);
  }


  updateMongoDB(_id, data) {
    return global.mongoConnection.updateById('admin-list', _id, data);

    // const updateDataQuery = `UPDATE datum SET name = '${data.name}', age = ${data.age} WHERE id = ${data.id}`;
    // return global.dbConnection.runQuery(updateDataQuery);
  }

 

  updateSkillMongoDB(_id, data) {
    return global.mongoConnection.updateById('admin-list-skills', _id, data);
  }

  async getAll() {
    const datum = await global.mongoConnection.find('admin-list');
    const skills = await global.mongoConnection.find('admin-list-skills');

    // Создание объекта для хранения навыков по идентификатору datum
    const skillsPlusDatumId = skills.reduce((acc, skill) => {
      if (!acc[skill.id_datum]) {
        acc[skill.id_datum] = [];
      }
      skill.skill_id = skill._id;

      acc[skill.id_datum].push(skill);
      return acc;
    }, {});

    datum.forEach((data) => {
      data.skills = skillsPlusDatumId[data._id] || [];
      data.id = data._id;
    });

    return datum;
  }


}

export default new AdminListAction();
