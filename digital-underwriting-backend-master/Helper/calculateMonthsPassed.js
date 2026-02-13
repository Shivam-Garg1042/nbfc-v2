export function getMonthsPassed(dateInput) {
  const inputDate = new Date(dateInput);

  if (isNaN(inputDate)) {
    throw new Error("Invalid date input");
  }

  const currentDate = new Date();

  const yearsDifference = currentDate.getFullYear() - inputDate.getFullYear();
  const monthsDifference = currentDate.getMonth() - inputDate.getMonth();

  const totalMonths = yearsDifference * 12 + monthsDifference;

  return totalMonths;
}
