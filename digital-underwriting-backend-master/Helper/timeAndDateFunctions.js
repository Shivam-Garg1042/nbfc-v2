export function getEndOfYesterdayIST() {
  const now = new Date();
  now.setDate(now.getDate() - 1);
  now.setHours(23, 59, 59, 999);

  return now.getTime();
}

export function getStartOf7DaysAgoFromYesterdayIST() {
  const now = new Date();
  now.setDate(now.getDate() - 7);
  now.setHours(0, 0, 0, 0);

  return now.getTime();
}
