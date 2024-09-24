import * as chai from 'chai';
import dotenv from 'dotenv';
import path from 'path';

import BackAdminListAction from '../lib/actions/BackAdminList.js';
import dbClass from '../lib/common/DbService.js';
import { getDirName } from '../lib/utils/functions.js';
import BackAdminListTestAction from './actions/BackAdminList.js';

const expect = chai.expect;

console.log('===import.meta.url', import.meta.url);

const __dirname = getDirName(import.meta.url);
const testDir = path.join(__dirname, '..');
dotenv.config({ path: `${testDir}/.testenv` });

global.dbConnection = new dbClass();

describe('Admin list tests', function() {
  it('Check adding user', async function() {
    const rowData = {
      name: 'Test name',
      age: 37,
    };

    const resultAddingList = await BackAdminListAction.add(rowData);

    const newData = await BackAdminListTestAction.get(resultAddingList.insertId);

    rowData.id = resultAddingList.insertId;

    expect(newData).to.deep.equal(rowData);
  });

  after(async () => {
    await BackAdminListTestAction.clearAdminListRecords();
  });
});