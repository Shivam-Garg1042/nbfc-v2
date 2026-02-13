export function calculateSixMonthDrivers(drivers) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const today = new Date();
  const currentMonth = today.getMonth(); // Current month (0-11)
  const currentYear = today.getFullYear();

  // Initialize the last 6 months excluding the current month
  const monthRange = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date(currentYear, currentMonth - i - 1, 1); // Adjust to get the correct month and year
    const monthYear = `${months[date.getMonth()]}-${date.getFullYear()}`;
    monthRange.push(monthYear);
  }

  // Helper function to parse date string to Date object
  const parseDate = (dateStr) => {
    if (!dateStr) return null; // Return null if the date is invalid or undefined

    const formats = [
      { regex: /^(\d{2})-(\w{3})-(\d{2})$/, format: "dd-MMM-yy" },
      { regex: /^(\d{2})\/(\d{2})\/(\d{4})$/, format: "dd/MM/yyyy" },
      { regex: /^(\d{4})-(\d{2})-(\d{2})$/, format: "yyyy-MM-dd" },
      {
        regex: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/,
        format: "ISO 8601",
      },
    ];

    for (const { regex, format } of formats) {
      const match = dateStr.match(regex);
      if (match) {
        let day, month, year;

        if (format === "dd-MMM-yy") {
          [_, day, month, year] = match;
          year = `20${year}`; // Convert 2-digit year to 4-digit
          month = months.indexOf(month) + 1; // Convert month name to number
        } else if (format === "dd/MM/yyyy") {
          [_, day, month, year] = match;
        } else if (format === "yyyy-MM-dd") {
          [_, year, month, day] = match;
        } else if (format === "ISO 8601") {
          return new Date(dateStr); // ISO 8601 is already in Date format
        }

        return new Date(`${year}-${month}-${day}`); // Return as Date object
      }
    }

    return null; // If no format matched
  };

  // Filter and group data for the last 6 full months
  const recentDrivers = drivers.filter((driver) => {
    const onboardingDate = parseDate(driver.Onboarding_Date);
    return (
      onboardingDate &&
      onboardingDate.getMonth() !== currentMonth && // Exclude current month
      onboardingDate >= new Date(currentYear, currentMonth - 6, 1) && // 6 months ago
      onboardingDate <= new Date(currentYear, currentMonth, 0) // Last day of the previous month
    );
  });

  const monthCounts = recentDrivers.reduce((acc, driver) => {
    const onboardingDate = parseDate(driver.Onboarding_Date);
    const monthYear = `${
      months[onboardingDate.getMonth()]
    }-${onboardingDate.getFullYear()}`;
    acc[monthYear] = (acc[monthYear] || 0) + 1;
    return acc;
  }, {});

  // Ensure all months in the range are included, even with a count of 0
  const finalResults = monthRange.map((month) => ({
    month,
    count: monthCounts[month] || 0,
  }));

  return finalResults;
}
