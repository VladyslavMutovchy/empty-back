const { MongoClient } = require('mongodb');

// URL подключения к MongoDB
const url = process.env.MONGO_URL || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME || 'myDatabase';

let db;

async function connectToMongoDB() {
    if (!db) {
        const client = new MongoClient(url);
        await client.connect();
        console.log("Успешно подключено к MongoDB");
        db = client.db(dbName);
    }
    return db;
}

module.exports = {
    connectToMongoDB
};
