import googleSheetController from "../Controllers/googleSheetController.js";
import redisClientSet from "../redisClientSet.js";
import redisClientGet from "../redisClientGet.js";

export default async function sheetCallRedis() {
  const startTime = Date.now();
  try {
    const cacheGoogleSheetKey = process.env.REDIS_ALL_DRIVERS;
    // console.log(`🔍 Checking Redis cache with key: ${cacheGoogleSheetKey}`);
    
    const cacheGoogleSheetData = await redisClientGet(cacheGoogleSheetKey);

    if (cacheGoogleSheetData.data !== null) {
      const cacheTime = Date.now() - startTime;
      console.log(`✅ CACHE HIT! Serving data from Redis cache in ${cacheTime}ms`);
      // console.log(`📊 Data size: ${JSON.stringify(cacheGoogleSheetData.data).length} characters`);
      return {
        error: null,
        data: cacheGoogleSheetData.data,
      };
    }

    let settingGoogleSheetDataInfo = null;

    console.log("❌ CACHE MISS! Getting fresh data from Google Sheets...");
    const response = await googleSheetController();
    const fetchTime = Date.now() - startTime;
    console.log(`📡 Google Sheets fetch completed in ${fetchTime}ms`);

    if (response.error === null && response.data) {
      // console.log(`💾 Storing ${response.data.length} records in Redis cache...`);
      settingGoogleSheetDataInfo = await redisClientSet(
        cacheGoogleSheetKey,
        response.data
      );
      // console.log(`✅ Data cached successfully!`);
    }

    return { settingGoogleSheetDataInfo, ...response };
  } catch (error) {
    return {
      error: { status: 401, message: "Bad Request" },
      data: null,
    };
  }
}
