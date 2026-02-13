import parseLoanAmount, { formatToRupeesInLakhs } from "./parseLoanAmount.js";
import reducerFunction from "./reducerFunction.js";
import createCamelCase from "./createCamelCase.js";

export default function calculateNBFCDashboard(totalDrivers, nbfcList) {
  let drivers;
  drivers = totalDrivers.filter(
    (driver) =>
      driver.initialStage &&
      driver.loginDate &&
      driver.stageTwoNBFC &&
      driver.stageTwoNBFC !== "None"
  );
  // if (nbfcList[0])
  //   drivers = nbfcList.map((nbfc) =>
  //     drivers.filter((driver) => driver.stageTwoNBFC.toLowerCase() === nbfc)
  //   );
  if (nbfcList)
    drivers = drivers.filter((driver) =>
      nbfcList.some(
        (nbfc) => driver.stageTwoNBFC.toLowerCase() === nbfc.toLowerCase()
      )
    );

  // APPROVED
  const approvedDrivers = drivers.filter(
    (driver) => driver.initialStage.toLowerCase() !== "rejected"
  );
  const approvedDriversAmount = reducerFunction(approvedDrivers, "loanAmount");
  // DO PENDING
  const DOPendingDrivers = drivers.filter(
    (driver) =>
      driver.initialStage.toLowerCase() === "fi pending" ||
      driver.initialStage.toLowerCase() === "tvr pending" ||
      driver.initialStage.toLowerCase() ===
        "gtr / co app cibil check pending" ||
      driver.initialStage.toLowerCase() === "tvr done"
  );
  const DOPendingDriversAmount = reducerFunction(
    DOPendingDrivers,
    "loanAmount"
  );
  // DO GENERATEDs
  const DOGeneratedDrivers = drivers.filter(
    (driver) => driver.initialStage.toLowerCase() === "at docket signing"
  );
  const DOGeneratedDriversAmount = reducerFunction(
    DOGeneratedDrivers,
    "loanAmount"
  );
  // DISBURSED
  const disbursedDrivers = drivers.filter(
    (driver) => driver.initialStage.toLowerCase() === "disbursed"
  );
  const disbursedDriversAmount = reducerFunction(
    disbursedDrivers,
    "loanAmount"
  );

  // ACTIVE vs CLOSED DISBURSED DRIVERS (based on Status column)
  const activeDisbursedDrivers = disbursedDrivers.filter(
    (driver) => driver.Status && driver.Status.toLowerCase() === "active"
  );
  const closedDisbursedDrivers = disbursedDrivers.filter(
    (driver) => !driver.Status || driver.Status.toLowerCase() !== "active"
  );

  // LOAN AMOUNTS FOR ACTIVE/CLOSED
  const activeDisbursedAmount = reducerFunction(activeDisbursedDrivers, "loanAmount");
  const closedDisbursedAmount = reducerFunction(closedDisbursedDrivers, "loanAmount");

  // EMI AMOUNT FOR DISBURSED CASES
  const totalEmiAmount = disbursedDrivers.reduce((sum, driver) => {
    return sum + (parseFloat(driver.emiAmount) || 0);
  }, 0);
  // OPPORTUNITY LOST
  const opportunityLostDrivers = drivers.filter(
    (driver) => driver.initialStage.toLowerCase() === "rejected"
  );
  const opportunityLostDriversAmount = reducerFunction(
    opportunityLostDrivers,
    "loanAmount"
  );
  // RUN KMs
  const runKmRange = ["0-20", "21-40", "41-60", "61-80", "81-100"];
  const runKMData = function () {
    const driverKMs = runKmRange.map((runkm) => {
      let splitRunKm = runkm.split("-");
      return drivers.filter(
        (driver) =>
          Math.ceil(driver.runKm) >= splitRunKm[0] &&
          Math.ceil(driver.runKm) <= splitRunKm[1]
      ).length;
    });

    const sum = driverKMs.reduce((accum, val) => accum + val, 0);
    const res = driverKMs.map((val) => ((val / sum) * 100).toFixed());

    const ans = res.map((val, i) => {
      return { value: res[i], name: runKmRange[i] };
    });

    return ans;
  };

  // DISBURSEMENT BY MONTH
  const getLastSixMonthsLoanAmounts = function () {
    const currentDate = new Date();

    // Helper function to get the start of a specific month
    function getStartOfMonth(year, month) {
      return new Date(year, month, 1);
    }

    // Generate the last 6 months dynamically (excluding the current month)
    const months = Array.from({ length: 6 }, (_, i) => {
      const monthDate = getStartOfMonth(
        currentDate.getFullYear(),
        currentDate.getMonth() - i // Exclude the current month
      );
      const nextMonthDate = getStartOfMonth(
        monthDate.getFullYear(),
        monthDate.getMonth() + 1
      );

      return {
        name: monthDate.toLocaleString("default", { month: "short" }),
        start: monthDate,
        end: nextMonthDate,
      };
    }).reverse(); // Reverse to ensure chronological order

    // Filter drivers based on their disbursedDate
    const filteredDrivers = drivers.filter((driver) => {
      const disbursedDate = new Date(driver.disbursedDate);
      return (
        disbursedDate >= months[0].start && // On or after the start of the first month
        disbursedDate < months[months.length - 1].end // Before the end of the last month
      );
    });

    // Sum loanAmount for each month
    return months.map((month) => {
      const monthlyDrivers = filteredDrivers.filter((driver) => {
        const disbursedDate = new Date(driver.disbursedDate);
        return disbursedDate >= month.start && disbursedDate < month.end;
      });

      return {
        name: month.name.charAt(0).toUpperCase() + month.name.slice(1).toLowerCase(),
        value: monthlyDrivers.reduce(
          (sum, driver) => sum + parseLoanAmount(driver.amount),
          0
        ),
        drivers: monthlyDrivers.length,
      };
    });
  };

  // DISBURSMENT BY CITY
  function getDriversLoanSumByCityExcludingCurrentMonth() {
    const currentDate = new Date();

    // Get the first date of the current month
    const startOfCurrentMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );

    // Filter out drivers from the current month
    // const filteredDrivers = disbursedDrivers.filter((driver) => {
    //   const loginDate = new Date(driver.loginDate);
    //   return loginDate < startOfCurrentMonth;
    // });

    // Segregate drivers by city and sum their loanAmount
    const result = [];

    disbursedDrivers.forEach((driver) => {
      const city =
        driver.city !== ""
          ? driver.city.toLowerCase() === "new delhi"
            ? "delhi"
            : driver.city.charAt(0).toUpperCase() + driver.city.slice(1).toLowerCase()
          : null; // Normalize city name to lowercase

      if (city === null) return;

      // Find an existing city object in the result
      const existingCity = result.find((item) => item.name === city);

      if (existingCity) {
        // If city exists, add to its value
        existingCity.value += parseLoanAmount(driver.loanAmount);
        existingCity.drivers += 1;
      } else {
        // If city doesn't exist, create a new entry
        result.push({
          name: city,
          value: parseLoanAmount(driver.loanAmount),
          drivers: 1,
        });
      }
    });

    return result;
  }
  // Login BY MONTH
  // function LoginByMonth() {
  //   const now = new Date();
  //   const currentMonth = now.getMonth();
  //   const currentYear = now.getFullYear();

  //   // const startOfMonth = (year, month) => new Date(year, month, 1);

  //   const lastSixMonths = [];
  //   for (let i = 0; i <= 5; i++) {
  //     const date = new Date(currentYear, currentMonth - i, 1);
  //     lastSixMonths.push({ year: date.getFullYear(), month: date.getMonth() });
  //   }

  //   return lastSixMonths.reverse().map((m) => {
  //     const monthDrivers = drivers.filter((driver) => {
  //       if (!driver.loginDate) return false;
  //       const login = new Date(driver.loginDate);
  //       return login.getFullYear() === m.year && login.getMonth() === m.month;
  //     });

  //     return {
  //       name: new Date(m.year, m.month, 1)
  //         .toLocaleString("default", {
  //           month: "short",
  //         })
  //         .toLowerCase(),
  //       drivers: monthDrivers.length,
  //     };
  //   });
  // }
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
  .toLocaleString("default", { month: "short" })
  .charAt(0).toUpperCase() + 
  new Date(m.year, m.month, 1)
  .toLocaleString("default", { month: "short" })
  .slice(1).toLowerCase(),
        drivers: monthDrivers.length,
      };
    });
  }

  // CASE DETAILS
  function getDriversSegregatedByMonth() {
    const currentDate = new Date();

    // Helper function to get the start of a specific month
    function getStartOfMonth(year, month) {
      return new Date(year, month, 1);
    }

    // Generate the last 6 months dynamically (excluding the current month)
    const months = Array.from({ length: 6 }, (_, i) => {
      const monthDate = getStartOfMonth(
        currentDate.getFullYear(),
        currentDate.getMonth() - i - 1 // Exclude the current month
      );
      const nextMonthDate = getStartOfMonth(
        monthDate.getFullYear(),
        monthDate.getMonth() + 1
      );

      return {
        name: monthDate.toLocaleString("default", { month: "short" }), // Capitalized month
        start: monthDate,
        end: nextMonthDate,
      };
    }).reverse(); // Reverse to ensure chronological order

    // Filter drivers based on loginDate
    const filteredDrivers = drivers.filter((driver) => {
      const loginDate = new Date(driver.loginDate);
      return (
        loginDate >= months[0].start &&
        loginDate < months[months.length - 1].end
      );
    });

    // Initialize result array
    const result = months.map((month) => {
      const monthlyDrivers = filteredDrivers.filter((driver) => {
        const loginDate = new Date(driver.loginDate);
        return loginDate >= month.start && loginDate < month.end;
      });

      const stats = {
        month: month.name, // Capitalized first letter
        disbursed: 0,
        approved: 0,
        rejected: 0,
        total: 0,
      };

      monthlyDrivers.forEach((driver) => {
        const initialStage = driver.initialStage.toLowerCase();
        if (initialStage === "disbursed") {
          stats.disbursed += 1;
        }
        if (initialStage !== "rejected") {
          stats.approved += 1;
        }
        if (initialStage === "rejected") {
          stats.rejected += 1;
        }
        stats.total = stats.approved + stats.rejected;
      });

      return stats;
    });

    return result;
  }

  // EMI TRENDS BY TENURE - Last 3 months
  function getEmiTrendsByTenure() {
    const currentDate = new Date();

    // Generate the last 3 months dynamically
    const months = Array.from({ length: 3 }, (_, i) => {
      const monthDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i - 1
      );
      const nextMonthDate = new Date(
        monthDate.getFullYear(),
        monthDate.getMonth() + 1
      );

      return {
        name: monthDate.toLocaleString("default", { month: "long" }),
        start: monthDate,
        end: nextMonthDate,
      };
    }).reverse(); // Reverse to ensure chronological order

    // Filter disbursed drivers based on disbursedDate
    const filteredDrivers = disbursedDrivers.filter((driver) => {
      const disbursedDate = new Date(driver.disbursedDate);
      return (
        disbursedDate >= months[0].start && 
        disbursedDate < months[months.length - 1].end
      );
    });

    return months.map((month) => {
      const monthlyDrivers = filteredDrivers.filter((driver) => {
        const disbursedDate = new Date(driver.disbursedDate);
        return disbursedDate >= month.start && disbursedDate < month.end;
      });

      // Group by tenure (12, 18, 24 months)
      const emi12Drivers = monthlyDrivers.filter(driver => 
        parseInt(driver.tenure) === 12 || parseInt(driver.Tenure) === 12
      );
      const emi18Drivers = monthlyDrivers.filter(driver => 
        parseInt(driver.tenure) === 18 || parseInt(driver.Tenure) === 18
      );
      const emi24Drivers = monthlyDrivers.filter(driver => 
        parseInt(driver.tenure) === 24 || parseInt(driver.Tenure) === 24
      );

      // Calculate total EMI amounts reimbursed
      const emi12Amount = emi12Drivers.reduce((sum, driver) => 
        sum + (parseFloat(driver.emiAmount) || 0), 0
      );
      const emi18Amount = emi18Drivers.reduce((sum, driver) => 
        sum + (parseFloat(driver.emiAmount) || 0), 0
      );
      const emi24Amount = emi24Drivers.reduce((sum, driver) => 
        sum + (parseFloat(driver.emiAmount) || 0), 0
      );

      return {
        month: month.name,
        emi12: emi12Drivers.length,
        emi18: emi18Drivers.length,
        emi24: emi24Drivers.length,
        loanReimbursed: {
          emi12: Math.round(emi12Amount),
          emi18: Math.round(emi18Amount),
          emi24: Math.round(emi24Amount)
        }
      };
    });
  }

  // REJECTION REASONS
  function getRejectionReasonCounts() {
    // Create a map to store counts
    const reasonCounts = {};

    // Iterate through drivers and count reasons
    drivers.forEach((driver) => {
      const reason = createCamelCase(driver.reasonOfRejection) || ""; // Handle missing reasons with empty string
      if (reason !== "") {
        reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
      }
    });
    let count = 0;
    drivers.forEach((val) => {
      val.reasonOfRejection !== "" && count++;
    });

    // Convert the object into an array of objects with reason and value properties
    const result = Object.entries(reasonCounts).map(([reason, value]) => ({
      name: reason,
      value:
        +((value / count) * 100).toFixed() === 0
          ? 1
          : ((value / count) * 100).toFixed(),
    }));

    return result;
  }
  const DOGeneratedAmount = DOGeneratedDriversAmount + disbursedDriversAmount;
  const disbursedAmount = disbursedDriversAmount;
  const DisbursPendingAmount = formatToRupeesInLakhs(
    DOGeneratedAmount - disbursedAmount
  );

  const wholeNBFCDashboardData = {
    cardsData: {
      totalCases: { totalCases: drivers.length, NPA: 0 },
      approved: {
        approved: approvedDrivers.length,
        amount: formatToRupeesInLakhs(approvedDriversAmount),
      },
      DOGenerated: {
        DOGenerated: DOGeneratedDrivers.length + disbursedDrivers.length,
        amount: formatToRupeesInLakhs(
          DOGeneratedDriversAmount + disbursedDriversAmount
        ),
      },
      disbursed: {
        disbursed: disbursedDrivers.length,
        amount: formatToRupeesInLakhs(disbursedDriversAmount),
        active: activeDisbursedDrivers.length,
        closed: closedDisbursedDrivers.length,
        activeAmount: formatToRupeesInLakhs(activeDisbursedAmount),
        closedAmount: formatToRupeesInLakhs(closedDisbursedAmount),
        emiAmount: formatToRupeesInLakhs(totalEmiAmount),
      },
      DisbursPending: {
        DisbursPending:
          +DOGeneratedDrivers.length +
          +disbursedDrivers.length -
          +disbursedDrivers.length,
        amount: DisbursPendingAmount,
      },
      opportunityLost: {
        opportunityLost: opportunityLostDrivers.length,
        amount: formatToRupeesInLakhs(opportunityLostDriversAmount),
      },
    },
    productData: {
      vehicle: {
        amount: formatToRupeesInLakhs(
          disbursedDrivers
            .filter(driver => driver.productType?.toLowerCase() === 'vehicle')
            .reduce((sum, driver) => sum + parseLoanAmount(driver.loanAmount), 0)
        ),
        count: drivers.filter(driver => driver.productType?.toLowerCase() === 'vehicle').length,
      },
      battery: {
        amount: formatToRupeesInLakhs(
          disbursedDrivers
            .filter(driver => driver.productType?.toLowerCase() === 'battery')
            .reduce((sum, driver) => sum + parseLoanAmount(driver.loanAmount), 0)
        ),
        count: drivers.filter(driver => driver.productType?.toLowerCase() === 'battery').length,
      },
    },
    runKMData: runKMData(),
    disbursmentByMonth: getLastSixMonthsLoanAmounts(),
    DisbursmentByCity: getDriversLoanSumByCityExcludingCurrentMonth(),
    LoginByMonth: LoginByMonth(),
    caseDetails: getDriversSegregatedByMonth(),
    rejectionReasons: getRejectionReasonCounts(),
    emiTrends: getEmiTrendsByTenure(),
  };

  // console.log(wholeNBFCDashboardData.DisbursmentByCity);

  return wholeNBFCDashboardData;
}
