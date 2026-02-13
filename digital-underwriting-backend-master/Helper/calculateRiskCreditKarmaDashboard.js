export function calculateRiskCreditKarmaDashboard(drivers) {
  const activeDrivers = drivers.filter((driver) => driver.Status === "Active");

  const ranges = {
    credit: {
      high: (score) => score > 650,
      medium: (score) => score >= 400 && score <= 650,
      low: (score) => score < 400,
    },
    risk: {
      high: (score) => score > 650,
      medium: (score) => score >= 450 && score <= 650,
      low: (score) => score < 450,
    },
    karma: {
      high: (score) => score > 700,
      medium: (score) => score >= 500 && score <= 700,
      low: (score) => score < 500,
    },
  };

  const calculateCategoryPercentages = (
    primaryKey,
    secondaryKey,
    primaryRanges,
    secondaryRanges,
    prefix1,
    prefix2
  ) => {
    const categories = {
      [`${prefix1}High${prefix2}High`]: 0,
      [`${prefix1}High${prefix2}Medium`]: 0,
      [`${prefix1}High${prefix2}Low`]: 0,
      [`${prefix1}Medium${prefix2}High`]: 0,
      [`${prefix1}Medium${prefix2}Medium`]: 0,
      [`${prefix1}Medium${prefix2}Low`]: 0,
      [`${prefix1}Low${prefix2}High`]: 0,
      [`${prefix1}Low${prefix2}Medium`]: 0,
      [`${prefix1}Low${prefix2}Low`]: 0,
    };

    // Categorize drivers
    activeDrivers.forEach((driver) => {
      const primaryScore = driver[primaryKey];
      const secondaryScore = driver[secondaryKey];

      let primaryCategory = undefined;
      let secondaryCategory = undefined;

      // Determine primary and secondary categories
      for (const [key, isInRange] of Object.entries(primaryRanges)) {
        if (isInRange(primaryScore)) {
          primaryCategory = key;
          break;
        }
      }
      for (const [key, isInRange] of Object.entries(secondaryRanges)) {
        if (isInRange(secondaryScore)) {
          secondaryCategory = key;
          break;
        }
      }

      // Check if both categories are valid
      if (primaryCategory && secondaryCategory) {
        const categoryKey = `${prefix1}${
          primaryCategory.charAt(0).toUpperCase() + primaryCategory.slice(1)
        }${prefix2}${
          secondaryCategory.charAt(0).toUpperCase() + secondaryCategory.slice(1)
        }`;

        if (categories[categoryKey] !== undefined) {
          categories[categoryKey]++;
        }
      }
    });

    // Convert counts to percentages
    const totalActiveDriversLength = activeDrivers.length;
    for (const key in categories) {
      categories[key] =
        Math.ceil((categories[key] / totalActiveDriversLength) * 100) + "%";
    }

    return categories;
  };

  const creditVsRisk = calculateCategoryPercentages(
    "creditScore",
    "riskScore",
    ranges.credit,
    ranges.risk,
    "Credit",
    "Risk"
  );

  const creditVsKarma = calculateCategoryPercentages(
    "creditScore",
    "karmaScore",
    ranges.credit,
    ranges.karma,
    "Credit",
    "Karma"
  );

  return {
    creditVsRisk,
    creditVsKarma,
  };
}
