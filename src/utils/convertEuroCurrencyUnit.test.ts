import {
  convertEuroToCent,
  convertCentToEuroString,
} from "./convertEuroCurrencyUnit";

const convertEuroToCentTestCases = [
  { euro: 1, expected: 100 },
  { euro: 2.5, expected: 250 },
  { euro: 0, expected: 0 },
  { euro: 3.14, expected: 314 },
  { euro: 19, expected: 1900 },
  { euro: 100, expected: 10000 },
];

const convertCentToEuroStringTestCases = [
  { cent: 100, expected: "1.00" },
  { cent: 250, expected: "2.50" },
  { cent: 0, expected: "0.00" },
  { cent: 123456, expected: "1234.56" },
  { cent: 123, expected: "1.23" },
  { cent: 1, expected: "0.01" },
];

describe("convertEuroToCent", () => {
  test.each(convertEuroToCentTestCases)(
    "should convert $euro euros to $expected cents",
    ({ euro, expected }) => {
      expect(convertEuroToCent(euro)).toBe(expected);
    }
  );

  test("should throw an error when euro is negative", () => {
    expect(() => convertEuroToCent(-1)).toThrowError(
      "Euro value cannot be negative"
    );
  });
});

describe("convertCentToEuroString", () => {
  test.each(convertCentToEuroStringTestCases)(
    "should convert $cent cents to formatted euro string $expected",
    ({ cent, expected }) => {
      expect(convertCentToEuroString(cent)).toBe(expected);
    }
  );

  test("should throw an error when cent is negative", () => {
    expect(() => convertCentToEuroString(-1000)).toThrowError(
      "Cent value cannot be negative"
    );
  });
});
