class AdminListAction {
  
  add(data) {
    const addDataQuery = `INSERT INTO datum SET name = '${data.name}', age = ${data.age}`;
    return global.dbConnection.runQuery(addDataQuery);
  }

  get(id) {
    const getDataQuery = `SELECT * FROM datum WHERE id = ${id}`;
    return global.dbConnection.runQuery(getDataQuery);
  }

  deleteById(id) {
    console.log('keep calm and test here =>',);
    const deleteDataQuery = `DELETE FROM datum WHERE id = ${id}`;
    return global.dbConnection.runQuery(deleteDataQuery);
  }

  getAll() {
    const getAllDataQuery = `SELECT * FROM datum`;
    return global.dbConnection.runQuery(getAllDataQuery);
  }
}




export default new AdminListAction();
// const addUserQuery = 'INSERT INTO users SET email = ?, password = ?, first_name = ?, last_name = ?, fb_id = ?, picture = ?';
    // const insertData = [
    //   authData.email,
    //   password,
    //   authData.first_name,
    //   authData.last_name,
    // ];