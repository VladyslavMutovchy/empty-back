class UserListAction {

  getAll() {
    const getAllUsersQuery = `SELECT * FROM users`;
    return global.dbConnection.runQuery(getAllUsersQuery);
  }
}

export default new UserListAction();
