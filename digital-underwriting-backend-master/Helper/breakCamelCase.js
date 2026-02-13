export default function breakCamelCase(text) {
  return (
    text
      // Insert a space before a number that follows a letter
      .replace(/([a-zA-Z])(\d)/g, "$1 $2")
      // Insert a space between a number and a letter that follows it
      .replace(/(\d)([a-zA-Z])/g, "$1 $2")
      // Insert a space before any uppercase letter that follows a lowercase letter
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      // Insert a space between sequences of uppercase letters followed by lowercase letters
      .replace(/([A-Z]+)(?=[A-Z][a-z]|\b)/g, "$1 ")
      .trim()
  );
}
