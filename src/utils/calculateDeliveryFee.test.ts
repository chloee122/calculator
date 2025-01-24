import { calculateDeliveryFee } from "./calculateDeliveryFee";

const distanceRanges = [
  { min: 0, max: 500, a: 0, b: 0, flag: null },
  { min: 500, max: 1000, a: 100, b: 0, flag: null },
  { min: 1000, max: 1500, a: 200, b: 0, flag: null },
  { min: 1500, max: 2000, a: 200, b: 1, flag: null },
  { min: 2000, max: 0, a: 0, b: 0, flag: null },
];

const validCases = [
  ["returns a delivery fee for distance within the first range", 499, 190, 190],
  ["returns a delivery fee for distance in the second range", 500, 190, 290],
  ["returns a delivery fee for distance in the third range", 1229, 190, 390],
  ["returns a delivery fee for distance in the fourth range", 1565, 190, 547],
  // add some test case that at the max value of the range
  // ["returns a delivery fee for distance for delivery distance of 1000", 1000, 190, 390],
  // ["returns a delivery fee for distance for delivery distance of 1999", 1999, 190, 590],
];

describe("calculateDeliveryFee", () => {
  test.each(validCases)("%s", (_, deliveryDistance, basePrice, expected) => {
    expect(
      calculateDeliveryFee(
        distanceRanges,
        deliveryDistance as number,
        basePrice as number
      )
    ).toEqual(expected);
  });

  test("throws an error when delivery distance is out of range", () => {
    expect(() => calculateDeliveryFee(distanceRanges, 2001, 190)).toThrowError(
      "The location is outside of the delivery range."
    );
  });
});
