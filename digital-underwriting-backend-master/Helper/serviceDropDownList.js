import NBFCNames from "./NBFCNames.js";

export default function serviceDropDownList(role, organization, drivers) {
  let filteredDrivers = drivers;

  if (role !== "admin" && role !== "employee" && role === "nbfc") {
    const organizationName = NBFCNames(organization);

    filteredDrivers = filteredDrivers.filter((driver) => {
      if (driver.NBFC === organizationName[0]) return driver;
    });
  }

  filteredDrivers = filteredDrivers.filter((driver) => {
    if (driver["Battery OEM"] !== "#N/A" && driver["Battery OEM"] !== "")
      return driver;
  });

  const OEMs = [
    ...new Set(filteredDrivers.map((driver) => driver["Battery OEM"])),
  ];

  return OEMs;
}
