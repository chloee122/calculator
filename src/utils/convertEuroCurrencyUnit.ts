const EURO_CENT_CONVERT_FACTOR = 100;

export const convertEuroToCent = (euro: number): number => {
  if (euro < 0) throw new Error("Euro value cannot be negative");

  return euro * EURO_CENT_CONVERT_FACTOR;
};

export const convertCentToEuroString = (cent: number): string => {
  if (cent < 0) throw new Error("Cent value cannot be negative");

  return (cent / EURO_CENT_CONVERT_FACTOR).toFixed(2);
};
