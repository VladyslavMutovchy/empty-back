import { expect, assert } from 'chai';
import dotenv from 'dotenv';
import path from 'path';

import AuthValidator from '../lib/validations/auth.js';
import dbClass from '../lib/common/DbService.js';
import { getDirName } from '../lib/utils/functions.js';
// import BackAdminListTestAction from './actions/BackAdminList.js';

console.log('===import.meta.url', import.meta.url);

const __dirname = getDirName(import.meta.url);
const testDir = path.join(__dirname, '..');
dotenv.config({ path: `${testDir}/.testenv` });

global.dbConnection = new dbClass();

describe('Auth test', function() {
  it('Try register without email', async function() {
    try {
      const userData = {
        password: '111111',
        first_name: 'Dima',
        last_name: 'Opr',
      };
  
      await AuthValidator.registration(userData);
      assert.fail('Try register without email failed');
    } catch (error) {
      const emailRequiredError = { email: 'Email is required' };
      expect(error).to.deep.equal(emailRequiredError);
    }
  });

  after(async () => {

    // await BackAdminListTestAction.clearAdminListRecords();
  });
});