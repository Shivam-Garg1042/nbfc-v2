export function calculateRunKm(drivers) {
  const totalDrivers = drivers.length;

  // Dynamically calculate the last three months (excluding the current month)
  const getLastThreeMonths = () => {
    const today = new Date();
    const months = [];
    for (let i = 3; i >= 1; i--) {
      // Start from three months ago
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      months.push(date.toLocaleString("default", { month: "long" }));
    }
    return months;
  };

  const monthNames = getLastThreeMonths(); // Now sorted oldest to newest
  const monthKeys = ["thirdLastRunKm", "secondLastRunKm", "lastRunKm"];

  // Initialize counts for ranges for each month
  const counts = monthKeys.map(() => [0, 0, 0, 0, 0]);

  // Calculate counts for each range
  drivers.forEach((driver) => {
    monthKeys.forEach((key, index) => {
      const runKm = parseFloat(driver[key]);

      if (!isNaN(runKm)) {
        if (runKm <= 20) {
          counts[index][0]++;
        } else if (runKm <= 40) {
          counts[index][1]++;
        } else if (runKm <= 60) {
          counts[index][2]++;
        } else if (runKm <= 80) {
          counts[index][3]++;
        } else {
          counts[index][4]++;
        }
      }
    });
  });

  // Format the data for output
  const runKmData = monthKeys.map((_, index) => {
    const data = counts[index].map(
      (count) => `${((count / totalDrivers) * 100).toFixed(0)}%`
    );
    return {
      name: monthNames[index],
      data,
    };
  });

  return runKmData;
}
