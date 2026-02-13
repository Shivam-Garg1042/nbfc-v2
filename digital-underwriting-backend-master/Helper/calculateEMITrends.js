export function calculateEMITrends(drivers) {
  // Filter active drivers
  const activeDrivers = drivers.filter((driver) => driver.Status === "Active");

  if (activeDrivers.length === 0) {
    return {
      emiOnTime: 0,
      emiTrends: [
        { value: 0, name: "<=7" },
        { value: 0, name: "8-15" },
        { value: 0, name: "16-22" },
        { value: 0, name: "23-30" },
        { value: 0, name: ">30" },
      ],
    };
  }

  // Initialize range counters
  const ranges = {
    "<=7": 0,
    "8-15": 0,
    "16-22": 0,
    "23-30": 0,
    ">30": 0,
  };

  let onTimeCount = 0;

  activeDrivers.forEach((driver) => {
    const days = driver.avgDPD;

    if (days <= 7) {
      ranges["<=7"] += 1;
      onTimeCount += 1;
    } else if (days > 7 && days <= 15) {
      ranges["8-15"] += 1;
      onTimeCount += 1;
    } else if (days > 15 && days <= 22) {
      ranges["16-22"] += 1;
    } else if (days > 22 && days <= 30) {
      ranges["23-30"] += 1;
    } else if (days > 30) {
      ranges[">30"] += 1;
    }
  });

  const totalActiveDrivers = activeDrivers.length;

  // Calculate raw percentages and sum
  const rawPercentages = Object.values(ranges).map(
    (count) => (count / totalActiveDrivers) * 100
  );
  let roundedPercentages = rawPercentages.map(Math.round);

  // Adjust to ensure sum is 100
  let adjustment = 100 - roundedPercentages.reduce((a, b) => a + b, 0);
  while (adjustment !== 0) {
    const idx = rawPercentages.findIndex((value, i) =>
      adjustment > 0
        ? roundedPercentages[i] < Math.ceil(value)
        : roundedPercentages[i] > Math.floor(value)
    );
    roundedPercentages[idx] += adjustment > 0 ? 1 : -1;
    adjustment = 100 - roundedPercentages.reduce((a, b) => a + b, 0);
  }

  const emiTrends = Object.keys(ranges).map((name, idx) => ({
    value: roundedPercentages[idx],
    name,
  }));

  return {
    emiOnTime: ((onTimeCount / totalActiveDrivers) * 100).toFixed(2),
    emiTrends,
  };
}
