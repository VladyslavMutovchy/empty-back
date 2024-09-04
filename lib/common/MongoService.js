import { MongoClient, ObjectId } from 'mongodb';

// let db;

// async function connectToMongoDB() {
//     if (!db) {
//         const client = new MongoClient(url);
//         await client.connect();
//         console.log("Успешно подключено к MongoDB");
//         db = client.db(dbName);
//     }
//     return db;
// }

const mongoClient = {
  db: null,
  connectToMongoDB: async function () {
    if (!this.db) {
      const client = new MongoClient(process.env.MONGO_URL);
      await client.connect();
      console.log('Успешно подключено к MongoDB');
      this.db = client.db(process.env.DB_NAME);
    }
  },
  collectionConnect: function (collectionName) {
    return global.mongoConnection.db.collection(collectionName);
  },
  insertOne: async function (collectionName, data) {
    const collection = this.collectionConnect(collectionName);
    return collection.insertOne(data);
  },
  findOne: async function (collectionName, params) {
    const collection = this.collectionConnect(collectionName);
    return collection.findOne(params);
  },
  find: async function (collectionName, params) {
    const collection = this.collectionConnect(collectionName);
    return collection.find(params).toArray();
  },
  update: async function (collectionName, params) {
    const collection = this.collectionConnect(collectionName);
    const setData = {
      $set: data,
    };
    return collection.update(params, setData);
  },
  updateById: async function (collectionName, _id, data) {
    const collection = this.collectionConnect(collectionName);
    const setData = {
      $set: data,
    };
    return collection.updateOne({ _id: new ObjectId(_id) }, setData);
  },

  deleteSkillById: async function (collectionName, id) {
    console.log('keep calm and test here =>', id);
    const collection = this.collectionConnect(collectionName);
    return collection.deleteOne({ _id: new ObjectId(id) });
  },

  deleteById: async function(datumCollectionName, skillCollectionName, id) {
    console.log('Deleting user with ID:', id);
    const datumCollection = this.collectionConnect(datumCollectionName);
    const skillCollection = this.collectionConnect(skillCollectionName);
    
    try {
      const deleteUserResult = await datumCollection.deleteOne({ _id: new ObjectId(id) });
      const deleteSkillsResult = await skillCollection.deleteMany({ id_datum: id });

      return {
        userDeleted: deleteUserResult.deletedCount > 0,
        skillsDeletedCount: deleteSkillsResult.deletedCount
      };
    } catch (error) {
      throw error;  
  }
  },
};

export default mongoClient;
