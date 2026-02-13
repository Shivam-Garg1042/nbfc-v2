export function calculateSocialFootPrint(score) {
  if (score <= 400) return "low";
  else if (score > 400 && score <= 650) return "medium";
  else if (score > 650) return "high";
}
