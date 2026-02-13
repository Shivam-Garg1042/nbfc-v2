import parseLoanAmount from "./parseLoanAmount.js";

export default function reducerFunction(drivers, property) {
  return drivers.reduce(
    (accum, driver) => accum + parseLoanAmount(driver[property]),
    0
  );
}
