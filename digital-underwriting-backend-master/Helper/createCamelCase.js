export default function createCamelCase(str) {
  return str
    .split(" ") // Split the string by spaces
    .map((word, index) => {
      if (word === word.toUpperCase()) {
        return word; // Preserve fully capitalized words
      }
      return index === 0
        ? word.toLowerCase() // First word in lowercase
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(); // Capitalize the first letter of other words
    })
    .join(""); // Join the words back together without spaces
}
