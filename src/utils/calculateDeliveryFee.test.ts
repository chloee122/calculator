import { calculateDeliveryFee } from "./calculateDeliveryFee";

const distanceRanges = [
  { min: 0, max: 500, a: 0, b: 0, flag: null },
  { min: 500, max: 1000, a: 100, b: 0, flag: null },
  { min: 1000, max: 1500, a: 200, b: 0, flag: null },
  { min: 1500, max: 2000, a: 200, b: 1, flag: null },
  { min: 2000, max: 0, a: 0, b: 0, flag: null },
];

const validCases = [
  ["should return a delivery fee for distance in the 1st range", 470, 190, 190],
  ["should return a delivery fee for distance in the 2nd range", 500, 190, 290],
  [
    "should return a delivery fee for distance in the 3rd range",
    1229,
    190,
    390,
  ],
  [
    "should return a delivery fee for distance in the 5th range",
    1565,
    190,
    547,
  ],
  [
    "should return a delivery fee for the 1st range's max distance ",
    499,
    190,
    190,
  ],
  [
    "should return a delivery fee for the 2nd range's max distance",
    999,
    190,
    290,
  ],
  [
    "should return a delivery fee for the 3rd range's max distance",
    1499,
    300,
    500,
  ],
  [
    "should return a delivery fee for the 4th range's max distance ",
    1999,
    300,
    700,
  ],
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
    expect(() => calculateDeliveryFee(distanceRanges, 2000, 190)).toThrowError(
      "The delivery distance is too long (2000 m)."
    );
  });
});
