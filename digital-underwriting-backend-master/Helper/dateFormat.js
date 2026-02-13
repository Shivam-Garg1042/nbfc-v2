export default function dateFormat(dateString) {
  dateString = JSON.stringify(dateString);
  if (dateString.length !== 8) {
    throw new Error("Invalid date format. Expected 'YYYYMMDD'.");
  }

  const year = dateString.slice(0, 4);
  const month = dateString.slice(4, 6);
  const day = dateString.slice(6, 8);

  return `${year}/${month}/${day}`;
}
