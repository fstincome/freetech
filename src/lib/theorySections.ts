/** Retain the legacy strategy records without publishing internal planning content. */
export const isPublicTheorySection = (key: string): boolean => {
  if (["period", "vision", "mission", "axes", "logic", "weDo", "weDont", "hypothesesTitle", "validated"].includes(key)) return false;
  return !key.startsWith("axis.") && !key.startsWith("assumption.") && !key.includes(".step.");
};