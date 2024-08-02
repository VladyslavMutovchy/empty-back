class UserListAction {

  getAll() {
    const getAllUsersQuery = `SELECT id, email FROM users`;
    return global.dbConnection.runQuery(getAllUsersQuery);
  }
}

export default new UserListAction();
