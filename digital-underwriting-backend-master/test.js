// VM

function LoginByMonth() {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const lastSixMonths = [];
  for (let i = 0; i <= 5; i++) {
    const date = new Date(currentYear, currentMonth - i, 1);
    lastSixMonths.push({ year: date.getFullYear(), month: date.getMonth() });
  }

  return lastSixMonths.reverse().map((m) => {
    const monthDrivers = drivers.filter((driver) => {
      if (!driver.loginDate) return false;

      const login = new Date(driver.loginDate);
      const year = login.getFullYear();
      const month = login.getMonth();

      return year === m.year && month === m.month;
    });

    return {
      name: new Date(m.year, m.month, 1)
        .toLocaleString("default", {
          month: "short",
        })
        .toLowerCase(),
      drivers: monthDrivers.length,
    };
  });
}

// Local
function LoginByMonth() {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const lastSixMonths = [];
  for (let i = 0; i <= 5; i++) {
    const date = new Date(currentYear, currentMonth - i, 1);
    lastSixMonths.push({ year: date.getFullYear(), month: date.getMonth() });
  }

  return lastSixMonths.reverse().map((m) => {
    const monthDrivers = drivers.filter((driver) => {
      if (!driver.loginDate) return false;

      const login = new Date(driver.loginDate);
      const year = login.getFullYear();
      const month = login.getMonth();

      return year === m.year && month === m.month;
    });

    return {
      name: new Date(m.year, m.month, 1)
        .toLocaleString("default", {
          month: "short",
        })
        .toLowerCase(),
      drivers: monthDrivers.length,
    };
  });
}
