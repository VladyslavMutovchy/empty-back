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

  async getAll(start, limit, search, filter_by, sort_by, sort_direction) {
    const getTotalQuantity = 'SELECT COUNT(*) AS total FROM datum';
    const totalQuantity = await global.dbConnection.runQuery(getTotalQuantity);

    const searchPattern = `%${search}%`;
    let getAllData, datum, skills, datumIds;

    let whereFields = [];
    const searchData = [];
    let whereConditionString = '';
    let findBySkill = false;

    if (search && filter_by) {
      if (filter_by !== 'all') {
        let table = 'd';

        if (filter_by === 'skills') {
          filter_by = 'skill';
          findBySkill = true;
          table = 'ds';
        }
        whereFields.push(`${table}.${filter_by}`);
      } else {
        whereFields.push('d.id', 'd.age', 'd.name', 'ds.skill');
        findBySkill = true;
      }

      if (findBySkill) {
        whereConditionString = `LEFT JOIN datum_skills AS ds ON ds.id_datum = d.id AND ds.skill LIKE ? `;
        searchData.push(searchPattern);
      }

      const whereCondition = whereFields
        .map((field) => {
          searchData.push(searchPattern);
          return `${field} LIKE ?`;
        })
        .join(' OR ');
      whereConditionString += `WHERE ${whereCondition}`;
    }

    let orderByString = '';
    let joinForSort = '';

    if (sort_by && sort_direction) {
      const direction = sort_direction.toUpperCase();
      if (sort_by === 'skills') {
        joinForSort = 'LEFT JOIN datum_skills AS ds ON ds.id_datum = d.id';
        orderByString = `ORDER BY ds.skill ${direction}, d.id`;
      } else {
        orderByString = `ORDER BY d.${sort_by} ${direction}, d.id`;
      }
    } else {
      orderByString = 'ORDER BY d.id'; // Сортировка по умолчанию
    }

    searchData.push(limit, start);

    getAllData = `
    SELECT DISTINCT d.*
    FROM datum AS d
    ${joinForSort}
    ${whereConditionString}
    ${orderByString}
    LIMIT ? OFFSET ?
  `;

    datum = await global.dbConnection.runQuery(getAllData, searchData);

    if (!datumIds) {
      datumIds = datum.map((d) => d.id);
    }

    if (datumIds.length > 0) {
      const getAllSkills = `SELECT * FROM datum_skills WHERE id_datum IN (${datumIds.join(
        ',',
      )})`;
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
