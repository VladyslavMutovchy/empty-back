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
}

export default new BackAdminListAction();
