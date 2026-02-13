import redisClient from "./redisClient.js";

export default async function redisClientGet(key) {
  try {
    const data = await redisClient.get(key);
    if (!data) {
      throw {
        message: "Data not found in Redis for the given key.",
        status: 404,
      };
    }
    return {
      data: JSON.parse(data),
      error: null,
    };
  } catch (err) {
    if (err.message === "Data not found in Redis for the given key.") {
      return {
        data: null,
        error: {
          message: "Data not found in Redis for the given key.",
          status: 404,
        },
      };
    } else {
      return {
        data: null,
        error: {
          message: "Redis error occurred while getting data.",
          status: 500,
        },
      };
    }
  }
}
