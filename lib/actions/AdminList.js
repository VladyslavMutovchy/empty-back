class AdminListAction {
  addMongoDB(data) {
    data.age = +data.age;
    return global.mongoConnection.insertOne('admin-list', data);
  }

  addSkillMongoDB(data) {
    return global.mongoConnection.insertOne('admin-list-skills', data);
  }

  add(data) {
    const addDataQuery = `INSERT INTO datum SET name = '${data.name}', age = ${data.age}`;
    return global.dbConnection.runQuery(addDataQuery);
  }

  addSkill(data) {
    const addSkillDataQuery = `INSERT INTO datum_skills SET skill = '${data.skill}', id_datum = ${data.id_datum}`;
    return global.dbConnection.runQuery(addSkillDataQuery);
  }

  get(id) {
    const getDataQuery = `SELECT * FROM datum WHERE id = ${id}`;
    return global.dbConnection.runQuery(getDataQuery);
  }
  async deleteSkillById(id) {
    console.log('keep calm and test here =>',id);
    const deleteSkillDataQuery = `DELETE FROM datum_skills WHERE skill_id = ?`;
    await global.dbConnection.runQuery(deleteSkillDataQuery, [id]);
  }

  async deleteById(id) {
    console.log('keep calm and test here =>', id);

    const deleteDataQuery = `DELETE FROM datum WHERE id = ?`;
    const deleteSkillAllDataQuery = `DELETE FROM datum_skills WHERE id_datum = ?`;

    await global.dbConnection.runQuery(deleteDataQuery, [id]);
    await global.dbConnection.runQuery(deleteSkillAllDataQuery, [id]);
  }

  update(data) {
    const updateDataQuery = `UPDATE datum SET name = '${data.name}', age = ${data.age} WHERE id = ${data.id}`;
    return global.dbConnection.runQuery(updateDataQuery);
  }

  updateMongoDB(_id, data) {
    return global.mongoConnection.updateById('admin-list', _id, data);

    // const updateDataQuery = `UPDATE datum SET name = '${data.name}', age = ${data.age} WHERE id = ${data.id}`;
    // return global.dbConnection.runQuery(updateDataQuery);
  }

  updateSkill(data) {
    const updateSkillDataQuery = `UPDATE datum_skills SET skill = '${data.skill}' WHERE skill_id = ${data.skill_id}`;
    return global.dbConnection.runQuery(updateSkillDataQuery);
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

  async deleteAll() {
    const deleteAllDataQuery = `DELETE FROM datum`;
    const deleteAllDataSkillQuery = `DELETE FROM datum_skills`;
    await global.dbConnection.runQuery(deleteAllDataQuery);
    await global.dbConnection.runQuery(deleteAllDataSkillQuery);
  }
}

export default new AdminListAction();
