class IBenchPanelAction {
  add(data) {
    const addDataQuery = `INSERT INTO project SET logoImg = '${data.logoImg}', avatar = '${data.avatar}', name = '${data.name}', age = ${data.age}, post = '${data.post}', email = '${data.email}', phone = '${data.phone}', headLocation = '${data.headLocation}', linkedin = '${data.linkedin}', twitter = '${data.twitter}', facebook = '${data.facebook}', paragraph = '${data.paragraph}'`;
    return global.dbConnection.runQuery(addDataQuery);
  }

}

export default new IBenchPanelAction();
