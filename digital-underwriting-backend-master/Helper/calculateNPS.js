export default function calculateNPS(drivers) {
  const ratings = [5, 4, 3, 2, 1];

  const NPSRatings = ratings.map((rating) => {
    return drivers.filter((driver) => Math.round(driver.NPS) === rating).length;
  });

  return NPSRatings;
}
