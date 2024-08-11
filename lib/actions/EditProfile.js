class EditProfileAction {
  upadte(data) {
    const updateDataQuery = `
      UPDATE users 
      SET 
        name = ?, 
        position = ?, 
        company_name = ?, 
        website = ?, 
        official_email = ?, 
        phone = ?, 
        founded = ?, 
        team = ?, 
        rates = ?, 
        country = ?, 
        city = ?, 
        about = ?
      WHERE id = ?
    `;
  
    const deleteIndustryDataQuery = `
      DELETE FROM industry 
      WHERE id_user = ?
    `;
  
    const addIndustryDataQuery = `
      INSERT INTO industry (id_user, industry)
      VALUES (?, ?)
    `;
  
    return global.dbConnection.runQuery(updateDataQuery, [
      data.name,
      data.position,
      data.companyName,
      data.website,
      data.officialEmail,
      data.phone,
      data.founded,
      data.team,
      data.rates,
      data.country,
      data.city,
      data.about,
      data.id 
    ])
    .then(() => {
      return global.dbConnection.runQuery(deleteIndustryDataQuery, [data.id]);
    })
    .then(() => {
      const industry = data.industry.split(',');
      console.log('===industry', industry);

      const industryQueries = industry.map(industry => 
        global.dbConnection.runQuery(addIndustryDataQuery, [data.id, industry])
      );
  
      return Promise.all(industryQueries);
    });
  }
  
  
  
  
  async get(id) {
    console.log('======>', id);
    
    const getUserData = `SELECT * FROM users WHERE id = ?`;
    const getIndustry = `SELECT * FROM industry WHERE id_user = ?`;
  
   
    const userData = await global.dbConnection.runQuery(getUserData, [id]);
    const industry = await global.dbConnection.runQuery(getIndustry, [id]);
  
    if (userData.length === 0) {
      throw new Error('User not found');
    }
  
    const user = userData[0]; 
  
    user.industry = industry.map(ind => ind.industry);
  
    console.log('======>', user);
    
    return user;
  }
  
}

export default new EditProfileAction();
