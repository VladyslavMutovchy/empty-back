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
dotenv.config({ path: `${testDir}/.envtest` });

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

describe('Get all records with filters', function() {
  this.timeout(3000); //таймаут 3 секунды

  it('Should retrieve filtered, sorted, and paginated data', async function() {
    console.log('Test started');

    // Test data for searching, filtering, sorting, and paginating
    const start = 0;
    const limit = 10;
    const search = 'Test name';
    const filter_by = 'name';
    const sort_by = 'age';
    const sort_direction = 'asc';

    // Mock data
    const rowData1 = { name: 'Test name', age: 30 };
    const rowData2 = { name: 'Test name 2', age: 25 };
    const rowData3 = { name: 'Another name', age: 40 };

    // Add mock data to the DB
    console.log('Adding mock data');
    await BackAdminListAction.add(rowData1);
    await BackAdminListAction.add(rowData2);
    await BackAdminListAction.add(rowData3);
    console.log('Mock data added');

    // Call the getAll method
    console.log('Calling getAll method');
    const result = await BackAdminListTestAction.getAll(start, limit, search, filter_by, sort_by, sort_direction);
    console.log('getAll method called');

    // Verify the total number of records found
    expect(result.total).to.be.at.least(1);
    expect(result.records).to.be.an('array');
    expect(result.records).to.have.lengthOf.at.most(limit);

    const firstRecord = result.records[0];
    const lastRecord = result.records[result.records.length - 1];

    expect(firstRecord.name).to.include(search);
    expect(firstRecord.age).to.be.at.most(lastRecord.age);

    // Clean up the test data
    await BackAdminListTestAction.clearAdminListRecords();
    console.log('Test finished');
  });

  after(async () => {
    console.log('Cleaning up test data');
    await BackAdminListTestAction.clearAdminListRecords();
    console.log('Test data cleaned up');
    process.exit(); // Завершение процесса после всех тестов
  });
});
