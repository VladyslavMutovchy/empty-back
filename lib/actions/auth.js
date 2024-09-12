import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import _ from 'lodash';

class AuthAction {
  async registration(authData) {
    let password = null;
    if (authData.password) {
      password = await bcrypt.hash(authData.password, 10);
    }

    const addUserQuery = 'INSERT INTO users SET email = ?, password = ?';
    const insertData = [authData.email, password];
    console.log(' before try', insertData);
   
    const newUserData = await global.dbConnection.runQuery(
      addUserQuery,
      insertData,
    );
    const userData = {
      ...authData,
      id: newUserData.insertId,
    };

    return this.login(userData);
  }

  async login(userData) {
    const loginUserData = _.pick(userData, [
      'id',
      'name',
      'email',
    ]);

    loginUserData.token = jwt.sign(
      {
        id: userData.id,
      },
      process.env.SECRET,
      { expiresIn: '7d' },
    );

    return loginUserData;
  }

  async authProceed(authData) {
    let whereCondition;
    const whereData = [];

    if (authData.fb_id) {
      whereCondition = 'fb_id = ?';
      whereData.push(authData.fb_id);
    } else if (authData.email) {
      whereCondition = 'email = ?';
      whereData.push(authData.email);
    } else {
      throw { message: 'Authentication error' };
    }

    const getUserQuery = `SELECT id, first_name, last_name, email, picture FROM users WHERE ${whereCondition}`;

    const userData = await global.dbConnection.runQuery(
      getUserQuery,
      whereData,
    );

    if (userData.length) {
      return this.login(userData[0]);
    }

    return this.registration(authData);
  }

  async getUserByEmail(email) {
    const checkQuery = 'SELECT * FROM users WHERE email = ?';
    const userData = await global.dbConnection.runQuery(checkQuery, [email]);
    return userData[0];
  }

  async facebookRegistration(facebookData) {
    const addUserQuery = 'INSERT INTO users SET facebook_id = ?, name = ?';
    const insertData = [facebookData.id, facebookData.displayName];
   
    const newUserData = await global.dbConnection.runQuery(
      addUserQuery,
      insertData,
    );

    const userData = {
      ...facebookData,
      id: newUserData.insertId,
    };

    return this.login(userData);
  }


  async facebookLogin(facebookData) {
    const getUserQuery = 'SELECT * FROM users WHERE facebook_id = ?';
    const [userData] = await global.dbConnection.runQuery(getUserQuery, [facebookData.id]);

    console.log('===userData', userData);

    if (userData) {
      return this.login(userData);
    }

    return this.facebookRegistration(facebookData);
  }

  async googleLogin(googleData) {
    const getUserQuery = 'SELECT * FROM users WHERE google_id = ?';
    const [userData] = await global.dbConnection.runQuery(getUserQuery, [googleData.id]);

    if (userData) {
      return this.login(userData);
    }

    return this.googleRegistration(googleData);
  }

  async googleRegistration(googleData) {
    const addUserQuery = 'INSERT INTO users SET google_id = ?, name = ?';
    const insertData = [googleData.id, googleData.displayName];

    const newUserData = await global.dbConnection.runQuery(
      addUserQuery,
      insertData,
    );

    const userData = {
      ...googleData,
      id: newUserData.insertId,
    };

    return this.login(userData);
  }
}



export default new AuthAction();
