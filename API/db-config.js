const mongodb = require('mongodb');

const uri = 'mongodb://db-mongo:27017';

const opcoes = {
  auth: {
    username: 'root',
    password: 'senha'
  }
};

const client = new mongodb.MongoClient(uri, opcoes);

const database = client.db('tpc');

const getNextId = async (collection) => {
  const id = await database.collection('counters')
    .findOneAndUpdate(
      { _id: collection },
      { $inc: { seq: 1 } },
      {
        returnDocument: 'after',
        upsert: true
      }
    );

  return id.seq;
}

module.exports = {
  client,
  database,
  getNextId
};