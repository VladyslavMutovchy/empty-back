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

  deleteById(id) {
    console.log('keep calm and test here =>', id);

    const deleteDataQuery = `DELETE FROM datum WHERE id = ${id}`;
    const deleteSkillDataQuery = `DELETE FROM datum_skills WHERE id_datum = ${id}`;

    return new Promise((resolve, reject) => {
      global.dbConnection.runQuery(deleteDataQuery, (err, result) => {
        if (err) {
          return reject(`Error deleting main record: ${err}`);
        }

        global.dbConnection.runQuery(deleteSkillDataQuery, (err, result) => {
          if (err) {
            return reject(`Error deleting related records: ${err}`);
          }

          console.log('Delete completed');
          resolve(result);
        });
      });
    });
  }

  update(data) {
    const updateDataQuery = `UPDATE datum SET name = '${data.name}', age = ${data.age} WHERE id = ${data.id}`;
    return global.dbConnection.runQuery(updateDataQuery);
  }
  async getAll() {
    const getAllData = `SELECT * FROM datum`;
    const getAllSkills = `SELECT * FROM datum_skills`;

    const data = await global.dbConnection.runQuery(getAllData);
    const skills = await global.dbConnection.runQuery(getAllSkills);

    // Создание объекта для хранения навыков по идентификатору datum
    const skillsPlusDatumId = skills.reduce((acc, skill) => {
      const { skill_id, id_datum, skill: skillName } = skill;
      if (!acc[id_datum]) {
        acc[id_datum] = [];
      }
      acc[id_datum].push({ skill_id, id_datum, skill: skillName });
      return acc;
    });

    // Объединение данных и навыков
    const getAllDataQuery = data.map((datum) => ({
      ...datum,
      skills: skillsPlusDatumId[datum.id] || [], // Добавление массива навыков или пустого массива, если навыков нет
    }));

    return getAllDataQuery;
  }

  async deleteAll() {
    const deleteAllDataQuery = `DELETE FROM datum`;
    return global.dbConnection.runQuery(deleteAllDataQuery); // Выполнение запроса к базе данных для удаления всех данных
  }
}

export default new AdminListAction();
