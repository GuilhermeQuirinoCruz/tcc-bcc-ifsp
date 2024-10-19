const redis = require('redis');

const client = redis.createClient(6379);

const connect = async() => {
  await client.connect();
}

const getNextId = async (tabela) => {
  try {
    let id = await client.get(tabela + ':id');
    if (!id) {
      id = 1;
    }

    await client.set(tabela + ':id', parseInt(id) + 1);
  
    return parseInt(id);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  client,
  connect,
  getNextId
};