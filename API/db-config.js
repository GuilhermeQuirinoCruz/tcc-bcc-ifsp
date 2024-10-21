const redis = require('redis');

const client = redis.createClient({
  url: 'redis://default:password@db-redis:6379'
});

const connect = async() => {
  await client.connect();
}

const getNextId = async (tabela) => {
  try {
    return parseInt(await client.INCR(tabela + ':id'));
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  client,
  connect,
  getNextId
};