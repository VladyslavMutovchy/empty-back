class BackAdminListAction {
  async get(id) {
    const getDataQuery = `SELECT * FROM datum WHERE id = ${id}`;
    const data = await global.dbConnection.runQuery(getDataQuery);
    return data[0];
  }

  clearAdminListRecords() {
    const clearDataQuery = 'TRUNCATE TABLE datum';
    return global.dbConnection.runQuery(clearDataQuery);
  }
  async getAll(start, limit, search, filter_by, sort_by, sort_direction) {

    const searchPattern = `%${search}%`;
    let getAllData, datum, skills, datumIds;

    let whereFields = [];
    const searchData = [];
    const searchCountData = [];
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
        searchCountData.push(searchPattern);
      }

      const whereCondition = whereFields
        .map((field) => {
          searchData.push(searchPattern);
          searchCountData.push(searchPattern);
          return `${field} LIKE ?`;
        })
        .join(' OR ');
      whereConditionString += `WHERE ${whereCondition}`;
    }

    let orderByString = '';
    let joinForSort = '';

    let additionalFields = '';

    if (sort_by && sort_direction) {
      const direction = sort_direction.toUpperCase();
      if (sort_by === 'skills') {
        additionalFields = ', (SELECT dss.skill FROM datum_skills AS dss WHERE dss.id_datum = d.id LIMIT 1) AS skill';
        orderByString = `ORDER BY skill ${direction}`;
      } else {
        orderByString = `ORDER BY d.${sort_by} ${direction}`;
      }
    } else {
      orderByString = 'ORDER BY d.id';
    }

    searchData.push(limit, start);

    getAllData = `
      SELECT d.*${additionalFields}
      FROM datum AS d
      ${joinForSort}
      ${whereConditionString}
      GROUP BY d.id, d.name, d.age
      ${orderByString}
      LIMIT ? OFFSET ?
    `;

    // const getTotalQuantity = `SELECT COUNT(*) AS total FROM datum`;
    const getTotalQuantity = `
      SELECT COUNT(*) AS total
      FROM (SELECT d.id FROM datum AS d
      ${joinForSort}
      ${whereConditionString}
      GROUP BY d.id) AS r
    `;

    console.log('===getTotalQuantity', getTotalQuantity);

    const totalQuantity = await global.dbConnection.runQuery(getTotalQuantity, searchCountData);

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

}

export default new BackAdminListAction();
