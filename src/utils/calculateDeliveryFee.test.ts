import { calculateDeliveryFee } from "./calculateDeliveryFee";

const distanceRanges = [
  { min: 0, max: 500, a: 0, b: 0, flag: null },
  { min: 500, max: 1000, a: 100, b: 0, flag: null },
  { min: 1000, max: 1500, a: 200, b: 0, flag: null },
  { min: 1500, max: 2000, a: 200, b: 1, flag: null },
  { min: 2000, max: 0, a: 0, b: 0, flag: null },
];

const testCases = [
  [
    "returns a delivery fee for distance within the first range",
    499,
    190,
    { distanceOutOfDeliveryRange: false, deliveryFee: 190 },
  ],
  [
    "returns a delivery fee for distance in the second range",
    500,
    190,
    { distanceOutOfDeliveryRange: false, deliveryFee: 290 },
  ],
  [
    "returns a delivery fee for distance in the third range",
    1229,
    190,
    { distanceOutOfDeliveryRange: false, deliveryFee: 390 },
  ],
  [
    "returns a delivery fee for distance in the fourth range",
    1565,
    190,
    { distanceOutOfDeliveryRange: false, deliveryFee: 547 },
  ],
  [
    "returns a delivery fee as 0 for distance out of range",
    2000,
    190,
    { distanceOutOfDeliveryRange: true, deliveryFee: 0 },
  ],
  [
    "returns valid delivery fee for any delivery distance within the ranges",
    100,
    0,
    { distanceOutOfDeliveryRange: false, deliveryFee: 0 },
  ],
];

describe("calculateDeliveryFee", () => {
  test.only.each(testCases)(
    "%s",
    (_, deliveryDistance, basePrice, expected) => {
      expect(
        calculateDeliveryFee(
          distanceRanges,
          deliveryDistance as number,
          basePrice as number
        )
      ).toStrictEqual(expected);
    }
  );
});
