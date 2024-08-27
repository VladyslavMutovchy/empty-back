class EditProfileAction {
  async update(data) {

    await global.dbConnection.runQuery('DELETE FROM user_awards WHERE user_id = ?', [data.id]);
    const updateDataQuery = `
      UPDATE users 
      SET 
        name = ?, 
        position = ?,
        photo = ?, 
        logo = ?, 
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

    if (data.award && Array.isArray(data.award)) {
      for (const award of data.award) {
        await this.addAward(data.id, award);
      }
    }

    return global.dbConnection
      .runQuery(updateDataQuery, [
        data.name,
        data.position,
        data.photo,
        data.logo,
        data.company_name,
        data.website,
        data.official_email,
        data.phone,
        data.founded,
        data.team,
        data.rates,
        data.country,
        data.city,
        data.about,
        data.id,
      ])
      .then(() => {
        return global.dbConnection.runQuery(deleteIndustryDataQuery, [data.id]);
      })
      .then(() => {
        const industry = data.industry.split(',');
        console.log('===industry', industry);

        const industryQueries = industry.map((industry) =>
          global.dbConnection.runQuery(addIndustryDataQuery, [
            data.id,
            industry,
          ]),
        );

        return Promise.all(industryQueries);
      });
  }

  async addAward(userId, awardData) {
    const addAwardQuery = `
      INSERT INTO user_awards (user_id, name, logo) 
      VALUES (?, ?, ?)
    `;
    return global.dbConnection.runQuery(addAwardQuery, [
      userId,
      awardData.name,
      awardData.logo,
    ]);
  }

  async get(id) {
    console.log('======>', id);

    const getUserData = `SELECT name, 
        position, 
        company_name, 
        website,
        photo, 
        logo,
        official_email, 
        phone, 
        founded, 
        team, 
        rates, 
        country, 
        city, 
        about FROM users WHERE id = ?`;

    const getIndustry = `SELECT * FROM industry WHERE id_user = ?`;

    const userData = await global.dbConnection.runQuery(getUserData, [id]);

    const user = userData[0];

    if (userData.length === 0) {
      throw new Error('User not found');
    }

    const industry = await global.dbConnection.runQuery(getIndustry, [id]);
    user.industry = industry.map((ind) => ind.industry);


    const getAwards = `SELECT * FROM user_awards WHERE user_id = ?`;
    user.awards = await global.dbConnection.runQuery(getAwards, [id]);

    console.log('===awards', user.awards);

    console.log('======>', user);

    return user;
  }
}

export default new EditProfileAction();
