class AdminListAction {
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

  async deleteById(id) {
    console.log('keep calm and test here =>', id);

    const deleteDataQuery = `DELETE FROM datum WHERE id = ?`;
    const deleteSkillDataQuery = `DELETE FROM datum_skills WHERE id_datum = ?`;

    await global.dbConnection.runQuery(deleteDataQuery, [id]);
    await global.dbConnection.runQuery(deleteSkillDataQuery, [id]);
  }

  update(data) {
    const updateDataQuery = `UPDATE datum SET name = '${data.name}', age = ${data.age} WHERE id = ${data.id}`;
    return global.dbConnection.runQuery(updateDataQuery);
  }
  async getAll() {
    const getAllData = `SELECT * FROM datum`;
    const getAllSkills = `SELECT * FROM datum_skills`;

    const datum = await global.dbConnection.runQuery(getAllData);
    const skills = await global.dbConnection.runQuery(getAllSkills);

    console.log('===data', datum);
    console.log('===skills', skills);

    // Создание объекта для хранения навыков по идентификатору datum
    const skillsPlusDatumId = skills.reduce((acc, skill) => {

      if (!acc[skill.id_datum]) {
        acc[skill.id_datum] = [];
      }

      acc[skill.id_datum].push(skill);
      return acc;
    }, {});

    datum.forEach(data => {
      data.skills = skillsPlusDatumId[data.id] || [];
    });

    return datum;
  }

  async deleteAll() {
    const deleteAllDataQuery = `DELETE FROM datum`;
    return global.dbConnection.runQuery(deleteAllDataQuery); // Выполнение запроса к базе данных для удаления всех данных
  }
}

export default new AdminListAction();
