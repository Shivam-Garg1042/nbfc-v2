import redisClient from "./redisClient.js";

export default async function redisClientSet(key, data) {
  try {
    await redisClient.setEx(key, 3600*24, JSON.stringify(data)); // 24 hours TTL

    return { dataSet: true, error: null };
  } catch (err) {
    return {
      dataSet: false,
      error: {
        message: "Redis error occurred while setting data.",
        status: 500,
      },
    };
  }
}
