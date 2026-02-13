export default function parseLoanAmount(value) {
  if (typeof value === "string") {
    value = value.replace(/[^0-9]/g, "");
  }
  // console.log(value);
  return Number(value);
}

export function formatToRupeesInLakhs(value) {
  if (typeof value !== "number") value = +value;

  if (isNaN(value)) return "₹0.00L";

  // Convert to lakhs with 2 decimal places
  const lakhs = value / 100000;

  return `₹${lakhs.toFixed(2)}L`;
}
