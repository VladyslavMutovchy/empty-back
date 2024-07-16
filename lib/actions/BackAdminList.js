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
  async getAll(start, limit, search, filter_by) {
    const getTotalQuantity = 'SELECT COUNT(*) AS total FROM datum';
    const totalQuantity = await global.dbConnection.runQuery(getTotalQuantity);
    const searchPattern = `%${search}%`;
    let getAllData, datum, skills, datumIds;

    if (search && filter_by !== 'all') {
        if (filter_by === 'id') {
            getAllData = `SELECT SQL_CALC_FOUND_ROWS * FROM datum WHERE id LIKE ? LIMIT ? OFFSET ?`;
            datum = await global.dbConnection.runQuery(getAllData, [
                searchPattern,
                limit,
                start,
            ]);
        } else if (filter_by === 'name') {
            getAllData = `SELECT SQL_CALC_FOUND_ROWS * FROM datum WHERE name LIKE ? LIMIT ? OFFSET ?`;
            datum = await global.dbConnection.runQuery(getAllData, [
                searchPattern,
                limit,
                start,
            ]);
        } else if (filter_by === 'age') {
            getAllData = `SELECT SQL_CALC_FOUND_ROWS * FROM datum WHERE age LIKE ? LIMIT ? OFFSET ?`;
            datum = await global.dbConnection.runQuery(getAllData, [
                searchPattern,
                limit,
                start,
            ]);
        } else if (filter_by === 'skills') {
            const searchBySkill = `SELECT DISTINCT id_datum FROM datum_skills WHERE skill LIKE ? LIMIT ? OFFSET ?`;
            const skillsResults = await global.dbConnection.runQuery(searchBySkill, [
                searchPattern,
                limit,
                start,
            ]);

            datumIds = skillsResults.map(skill => skill.id_datum);
            if (datumIds.length > 0) {
                getAllData = `SELECT SQL_CALC_FOUND_ROWS * FROM datum WHERE id IN (${datumIds.join(',')}) LIMIT ? OFFSET ?`;
                datum = await global.dbConnection.runQuery(getAllData, [
                    limit,
                    start,
                ]);
            } else {
                datum = [];
            }
        }
    } else if (search) {
        getAllData = `SELECT SQL_CALC_FOUND_ROWS * FROM datum WHERE id LIKE ? OR age LIKE ? OR name LIKE ? LIMIT ? OFFSET ?`;
        datum = await global.dbConnection.runQuery(getAllData, [
            searchPattern,
            searchPattern,
            searchPattern,
            limit,
            start,
        ]);
    } else {
        getAllData = `SELECT SQL_CALC_FOUND_ROWS * FROM datum LIMIT ? OFFSET ?`;
        datum = await global.dbConnection.runQuery(getAllData, [limit, start]);
    }

    if (!datumIds) {
        datumIds = datum.map((d) => d.id);
    }

    if (datumIds.length > 0) {
        const getAllSkills = `SELECT * FROM datum_skills WHERE id_datum IN (${datumIds.join(',')})`;
        skills = await global.dbConnection.runQuery(getAllSkills);
    } else {
        skills = [];
    }

    let skillsPlusDatumId = skills.reduce((acc, skill) => {
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
