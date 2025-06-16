import redis from "redis";

const redisClient = redis.createClient();

redisClient.on('error', (error) => console.error(`Error connecting to Redis: ${error.message}`));

await redisClient.connect();

export default redisClient;
