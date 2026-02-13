export function calculateVehicleAge(dateInput) {
  const inputDate =
    typeof dateInput === "string" && /^\d{2}-\d{2}-\d{4}$/.test(dateInput)
      ? new Date(dateInput.split("-").reverse().join("-"))
      : new Date(dateInput);

  if (isNaN(inputDate)) return null; // Invalid date

  const today = new Date();
  const yearDiff = today.getFullYear() - inputDate.getFullYear();
  const monthDiff = today.getMonth() - inputDate.getMonth();
  const totalMonths = yearDiff * 12 + monthDiff;

  return today.getDate() >= inputDate.getDate() ? totalMonths : totalMonths - 1;
}
