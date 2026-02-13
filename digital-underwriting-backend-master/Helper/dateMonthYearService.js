export default function dateMonthYearService(
  headFilteredData,
  input,
  dateType
) {
  let newData = headFilteredData;

  const extractYear = Object.entries(input).map(([key, value]) => {
    return {
      [key.slice(4)]: [...value.map((val) => val.toLowerCase())],
    };
  });

  let complaintFilteredData = [];

  extractYear.forEach((val) => {
    const [year, months] = Object.entries(val)[0];

    const game = newData.filter((service) => {
      return (
        +new Date(service[dateType]).getUTCFullYear() === +year &&
        months.includes(
          new Date(service[dateType])
            .toLocaleString("en-US", {
              month: "long",
            })
            .slice(0, 3)
            .toLowerCase()
        )
      );
    });

    // console.log("🙌🙌🙌", year, game.length);
    // complaintFilteredData.push(...game);
  });

  // console.log(complaintFilteredData.length);
  // console.log(headFilteredData.length);

  return complaintFilteredData;
}
