class IBenchPanelAction {
  add(data) {
    const addDataQuery = `INSERT INTO project SET logo_img = '${data.logoImg}', avatar = '${data.avatar}', name = '${data.name}', post = '${data.post}', email = '${data.email}', phone = '${data.phone}', head_location = '${data.headLocation}', linkedin = '${data.linkedin}', twitter = '${data.twitter}', facebook = '${data.facebook}', paragraph = '${data.paragraph}'`;

    return global.dbConnection.runQuery(addDataQuery);
  }
  getAll() {
    const getAllDataQuery = `SELECT * FROM project`;
    return global.dbConnection.runQuery(getAllDataQuery);
  }
}

export default new IBenchPanelAction();
