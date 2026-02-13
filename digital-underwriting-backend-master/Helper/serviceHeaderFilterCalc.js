import dateMonthYearService from "./dateMonthYearService.js";

export default function serviceHeaderFilterCalc(serviceData, headerFilters) {
  let headFilteredData = serviceData;
  const currentDate = new Date();
  const currentYear = currentDate.getUTCFullYear();
  const currentMonth = currentDate.getUTCMonth(); // 0-based index (0 = Jan, 1 = Feb, ...)

  headFilteredData = headFilteredData.filter(({ complaintDate }) => {
    const date = new Date(complaintDate);
    return (
      date.getUTCFullYear() !== currentYear ||
      date.getUTCMonth() !== currentMonth
    );
  });
  const filterFun = function (param, arr) {
    return headFilteredData.filter((val) => !arr.includes(val[param]));
  };

  // 1. Handover Date Filter
  if (
    headerFilters?.complaintDate &&
    Object.entries(headerFilters?.complaintDate)?.[0]?.[1]?.[0]
  ) {
    headFilteredData = filterFun("complaintDate", [""]);
    headFilteredData = dateMonthYearService(
      headFilteredData,
      headerFilters.complaintDate,
      "complaintDate"
    );
  }

  // 2. Complaint Date Filter
  if (
    headerFilters?.handoverDate &&
    Object.entries(headerFilters?.handoverDate)?.[0]?.[1]?.[0]
  ) {
    headFilteredData = filterFun("handoverDate", [""]);
    headFilteredData = dateMonthYearService(
      headFilteredData,
      headerFilters.handoverDate,
      "handoverDate"
    );
  }

  // 3. Zone Filter
  if (headerFilters?.zone && headerFilters?.zone[0]) {
    headFilteredData = filterFun("city", ["#N/A", ""]);
    headFilteredData = headFilteredData.filter((val) =>
      headerFilters.zone.includes(val.city.toLowerCase())
    );
  }

  //   // 4. BMS Filter
  if (headerFilters?.BMS && headerFilters?.BMS[0]) {
    headerFilters.BMS = headerFilters.BMS.map((val) => val.toLowerCase());
    headFilteredData = filterFun("BMS", [""]);
    headFilteredData = headFilteredData.filter((val) =>
      headerFilters.BMS.includes(val.BMS.toLowerCase())
    );
  }

  return headFilteredData;
}
