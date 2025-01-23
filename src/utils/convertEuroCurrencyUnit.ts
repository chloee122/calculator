const EURO_CENT_CONVERT_FACTOR = 100;

export const convertEuroToCent = (euro: number): number => {
  return euro * EURO_CENT_CONVERT_FACTOR;
};

export const convertCentToEuroString = (cent: number): string => {
  return (cent / EURO_CENT_CONVERT_FACTOR).toFixed(2);
};
