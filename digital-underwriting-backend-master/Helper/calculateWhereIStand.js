export function calculateWhereIStand(drivers) {
  if (drivers === null) {
    return [
      { score: "0-400", percent: "4.76", color: "#00953c" },
      { score: "401-500", percent: "32.20", color: "#1aa050" },
      { score: "501-600", percent: "40.64", color: "#f9f906" },
      { score: "601-750", percent: "22.40", color: "#ff9c38" },
      { score: "751-999", percent: "0.00", color: "#f01010" },
    ];
  }
  const ranges = [
    { range: "0-400", min: 0, max: 400, color: "#00953c" },
    { range: "401-500", min: 401, max: 500, color: "#1aa050" },
    { range: "501-600", min: 501, max: 600, color: "#f9f906" },
    { range: "601-750", min: 601, max: 750, color: "#ff9c38" },
    { range: "751-999", min: 751, max: 999, color: "#f01010" },
  ];

  const activeDrivers = drivers.filter((driver) => driver.Status === "Active");
  const result = ranges.map(({ range, min, max, color }) => {
    const count = activeDrivers.filter(
      (driver) => driver.riskScore >= min && driver.riskScore <= max
    ).length;
    return {
      score: range,
      percent: ((count / activeDrivers.length) * 100).toFixed(2) + "%",
      color,
    };
  });

  return result;
}
