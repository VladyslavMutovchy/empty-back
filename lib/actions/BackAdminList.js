class BackAdminListAction {
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
    console.log('keep calm and test here =>', id);
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

  updateSkill(data) {
    const updateSkillDataQuery = `UPDATE datum_skills SET skill = '${data.skill}' WHERE skill_id = ${data.skill_id}`;
    return global.dbConnection.runQuery(updateSkillDataQuery);
  }
 async getAll(start, limit) {
   const getTotalQuantity = 'SELECT COUNT(*) AS total from datum';
    const totalQuantity = await global.dbConnection.runQuery(getTotalQuantity);
    console.log('===totalQuantity', totalQuantity);

    const getAllData = `SELECT SQL_CALC_FOUND_ROWS * FROM datum LIMIT ? OFFSET ?`;
    const datum = await global.dbConnection.runQuery(getAllData, [limit, start]);

    const datumIds = datum.map(d => d.id);
    const getAllSkills = `SELECT * FROM datum_skills WHERE id_datum IN (${datumIds.join(',')})`;
    const skills = await global.dbConnection.runQuery(getAllSkills);

    // Создание объекта для хранения навыков по идентификатору datum
    const skillsPlusDatumId = skills.reduce((acc, skill) => {
      if (!acc[skill.id_datum]) {
        acc[skill.id_datum] = [];
      }

      acc[skill.id_datum].push(skill);
      return acc;
    }, {});

    datum.forEach((data) => {
      data.skills = skillsPlusDatumId[data.id] || [];
    });

    return { records: datum, total: totalQuantity[0].total };
  }

  async deleteAll() {
    const deleteAllDataQuery = `DELETE FROM datum`;
    const deleteAllDataSkillQuery = `DELETE FROM datum_skills`;
    await global.dbConnection.runQuery(deleteAllDataQuery);
    await global.dbConnection.runQuery(deleteAllDataSkillQuery);
  }
}

export default new BackAdminListAction();
