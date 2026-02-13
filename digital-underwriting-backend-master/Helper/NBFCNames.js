export default function NBFCNames(newArr) {
  // Handle undefined, null, or empty string cases
  if (!newArr || newArr === '') return null;
  
  const arr = newArr.split(",");

  if (arr[0] === "") return null;
  const nbfcs = {
    chargeup: "Chargeup",
    shivakari: "Shivakari",
    ascend: "Ascend",
    megaCorp: "Mega Corp",
    SVCL: "SVCL",
  };

  return arr.map((val) => nbfcs[val]);
}
