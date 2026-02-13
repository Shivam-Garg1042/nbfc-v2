export function calculateBusinessInsights(drivers) {
  // Helper function to calculate percentages
  const calculatePercentages = (data) => {
    const total = drivers.length;
    for (const key in data) {
      data[key] = ((data[key] / total) * 100).toFixed();
    }
    return data;
  };

  const vehicleFinanced = { yes: 0, no: 0 };
  const identityConfidence = { high: 0, medium: 0, low: 0 };
  const phoneNameMatchScore = { high: 0, medium: 0, low: 0 };
  const driversUsingUpi = { yes: 0, no: 0 };
  const digitalFootprint = { high: 0, medium: 0, low: 0 };
  const socialFootprint = { high: 0, medium: 0, low: 0 };
  const phoneFootprint = { high: 0, medium: 0, low: 0 };
  const digitalAge = { high: 0, medium: 0, low: 0 };
  const phoneNetwork = { prepaid: 0, postpaid: 0 };
  const metrics = {
    socialMediaPlatform: {
      amazon: 0,
      whatsapp: 0,
      waBusiness: 0,
      instagram: 0,
      flipkart: 0,
      paytm: 0,
    },
  };

  let totalCredit = 0;
  const range = { lowCount: 0, mediumCount: 0, highCount: 0 };
  const uniqueCities = new Set(); // To store unique cities

  for (const driver of drivers) {
    // VEHICLE_FINANCED
    vehicleFinanced[driver.vehicleFinance ? "yes" : "no"]++;

    // IDENTITY_CONFIDENCE
    identityConfidence[driver.identityConfidence.toLowerCase()]++;

    // PHONE_NAME_MATCH_SCORE
    const score = driver.phoneNameMatchScore;
    phoneNameMatchScore[score > 70 ? "high" : score >= 40 ? "medium" : "low"]++;

    // DRIVERS_USING_UPI
    driversUsingUpi[driver.vpa ? "yes" : "no"]++;

    // DIGITAL_FOOTPRINT
    digitalFootprint[driver.digitalFootprint.toLowerCase()]++;

    // SOCIAL_FOOTPRINT
    const sfScore = driver.socialFootprintScore;
    socialFootprint[
      sfScore > 550 ? "high" : sfScore >= 300 ? "medium" : "low"
    ]++;

    // SOCIAL_MEDIA_PLATFORM
    [
      "amazon",
      "instagram",
      "whatsapp",
      "waBusiness",
      "flipkart",
      "paytm",
    ].forEach((platform) => {
      if (driver[platform] === "Account Found")
        metrics.socialMediaPlatform[platform]++;
    });

    // PHONE_FOOTPRINT
    phoneFootprint[driver.phoneFootprint.toLowerCase()]++;

    // DIGITAL_AGE
    const dAge = driver.digitalage;
    digitalAge[dAge > 550 ? "high" : dAge >= 400 ? "medium" : "low"]++;

    // PHONE_NETWORK
    phoneNetwork[driver.phoneNetwork]++;

    // CREDIT_SCORE_RANGE
    const creditScore = driver.creditScore;
    if (creditScore > 0 && creditScore < 450) {
      range.lowCount++;
      totalCredit += creditScore;
    } else if (creditScore >= 450 && creditScore <= 650) {
      range.mediumCount++;
      totalCredit += creditScore;
    } else if (creditScore > 650) {
      range.highCount++;
      totalCredit += creditScore;
    }

    // COLLECT UNIQUE CITIES
    if (driver.Es_City) {
      uniqueCities.add(driver.Es_City);
    }
  }

  // PERCENTILE_CREDIT_AREA
  const creditDrivers = range.lowCount + range.mediumCount + range.highCount;
  const resultRange = {
    lowCreditPercentage: range.lowCount === 0 ? 0 : range.lowCount,
    mediumCreditPercentage: range.mediumCount === 0 ? 0 : range.mediumCount,
    highCreditPercentage: range.highCount === 0 ? 0 : range.highCount,
  };
  const avgCredit =
    totalCredit === 0 ? 0 : (totalCredit / creditDrivers).toFixed();

  // Convert all metrics to percentages
  for (const key in metrics) {
    metrics[key] = calculatePercentages(metrics[key]);
  }

  return {
    length: drivers.length,
    avgCredit,
    resultRange,
    vehicleFinanced,
    identityConfidence,
    phoneNameMatchScore,
    driversUsingUpi,
    digitalFootprint,
    socialFootprint,
    phoneFootprint,
    digitalAge,
    phoneNetwork,
    uniqueCities: Array.from(uniqueCities), // Convert Set to Array
    ...metrics,
  };
}
