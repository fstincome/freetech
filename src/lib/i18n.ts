export type Lang = "en" | "fr" | "sw";

/** Returns the translated value of a field for the active language, falling back to the base column. */
export const tr = (item: any, field: string, lang: Lang): string => {
  const v = item?.translations?.[lang]?.[field];
  return typeof v === "string" && v.trim() !== "" ? v : (item?.[field] ?? "");
};
