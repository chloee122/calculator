const EURO_CENT_CONVERT_FACTOR = 100;

export const convertEuroToCent = (euro: number): number => {
  // handle negative, return 0 if negative
  return euro * EURO_CENT_CONVERT_FACTOR;
};

export const convertCentToEuroString = (cent: number): string => {
  // handle negative, return 0 if negative
  return (cent / EURO_CENT_CONVERT_FACTOR).toFixed(2);
};
