import redisClientSet from "../redisClientSet.js";
import redisClientGet from "../redisClientGet.js";
import serviceGoogleSheetController from "../Controllers/serviceGoogleSheetController.js";

export default async function sheetCallRedisService() {
  try {
    const cacheServiceGoogleSheetKey = process.env.REDIS_SERVICE_DATA;
    const cacheServiceGoogleSheetData = await redisClientGet(
      cacheServiceGoogleSheetKey
    );

    if (cacheServiceGoogleSheetData.data !== null) {
      // console.log(
      //   `serving service data from redis cache key: ${cacheServiceGoogleSheetKey}`
      // );
      return {
        error: null,
        data: cacheServiceGoogleSheetData.data,
      };
    }

    let settingGoogleSheetDataInfo = null;

    // console.log("getting fresh service data from the googleSheet");
    const response = await serviceGoogleSheetController();

    if (response.error === null && response.data) {
      settingGoogleSheetDataInfo = await redisClientSet(
        cacheServiceGoogleSheetKey,
        response.data
      );
    }

    if (cacheServiceGoogleSheetData.error.status === 500) {
      return {
        settingGoogleSheetDataInfo,
        gettingGoogleSheetDataInfo: cacheServiceGoogleSheetData.error,
        ...response,
      };
    }
    return { settingGoogleSheetDataInfo, ...response };
  } catch (error) {
    return {
      error: { status: 401, message: "Bad Request" },
      data: null,
    };
  }
}
