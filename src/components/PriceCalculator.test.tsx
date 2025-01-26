import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";
import PriceCalculator from "./PriceCalculator";
import * as venueMethods from "../api/venues";
import * as userCoordinateMethods from "../utils/getUserCoordinates";

const testVenueDeliveryOrderInfo = {
  venueLatitude: 60.17012143,
  venueLongitude: 24.92813512,
  orderMinimumNoSurcharge: 1000,
  basePrice: 190,
  distanceRanges: [
    { min: 0, max: 500, a: 0, b: 0, flag: null },
    { min: 500, max: 1000, a: 100, b: 0, flag: null },
    { min: 1000, max: 1500, a: 200, b: 0, flag: null },
    { min: 1500, max: 2000, a: 200, b: 1, flag: null },
    { min: 2000, max: 0, a: 0, b: 0, flag: null },
  ],
};

describe("PriceCalculator", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("should display a toast notification if permission to get location is denied/blocked", async () => {
    vi.spyOn(
      userCoordinateMethods,
      "getUserCoordinates"
    ).mockImplementationOnce(() => {
      return Promise.reject(
        new Error("Please turn on location sharing in your browser's settings.")
      );
    });

    render(<PriceCalculator />);

    const user = userEvent.setup();

    const getLocationButton = screen.getByText("Get location");
    await user.click(getLocationButton);

    const toastMessage = await screen.findByText(
      "Please turn on location sharing in your browser's settings."
    );

    expect(toastMessage).toBeInTheDocument();
  });

  test("should display error message when endpoint returns other error", async () => {
    vi.spyOn(venueMethods, "getVenueDeliveryOrderInfo").mockImplementationOnce(
      () => {
        return Promise.reject(new Error("Internal server error"));
      }
    );

    render(<PriceCalculator />);

    const user = userEvent.setup();
    const venueSlugField = screen.getByPlaceholderText("Enter venue slug");
    const cartValueField = screen.getByPlaceholderText("Enter cart value");
    const userLatitudeField = screen.getByPlaceholderText(
      "Enter user latitude"
    );
    const userLongitudeField = screen.getByPlaceholderText(
      "Enter user longitude"
    );

    await user.type(venueSlugField, "home-assignment-venue-helsinki");
    await user.type(cartValueField, "5.93");
    await user.type(userLatitudeField, "60.1846967");
    await user.type(userLongitudeField, "24.9349696");

    const calculateButton = screen.getByText("Calculate delivery fee");
    await user.click(calculateButton);

    const errorMessage = await screen.findByText(
      "Cannot calculate the delivery fee. Internal server error"
    );
    expect(errorMessage).toBeInTheDocument();
  });

  test("should show price breakdown component on successful calculation", async () => {
    vi.spyOn(venueMethods, "getVenueDeliveryOrderInfo").mockImplementationOnce(
      () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(testVenueDeliveryOrderInfo);
          }, 500);
        });
      }
    );

    const expectedPriceItems = [
      { value: "5.93", rawValue: "593" },
      { value: "5.57", rawValue: "557" },
      { value: "1666", rawValue: "1666" },
      { value: "4.07", rawValue: "407" },
      { value: "15.57", rawValue: "1557" },
    ];

    render(<PriceCalculator />);

    const user = userEvent.setup();
    const venueSlugField = screen.getByPlaceholderText("Enter venue slug");
    const cartValueField = screen.getByPlaceholderText("Enter cart value");
    const userLatitudeField = screen.getByPlaceholderText(
      "Enter user latitude"
    );
    const userLongitudeField = screen.getByPlaceholderText(
      "Enter user longitude"
    );

    await user.type(venueSlugField, "home-assignment-venue-helsinki");
    await user.type(cartValueField, "5.93");
    await user.type(userLatitudeField, "60.1846967");
    await user.type(userLongitudeField, "24.9349696");

    const calculateButton = screen.getByText("Calculate delivery fee");
    await user.click(calculateButton);

    const priceBreakdown = screen.getByText("Price Breakdown");
    expect(priceBreakdown).toBeInTheDocument();

    for (const item of expectedPriceItems) {
      const value = await screen.findByText(item.value);

      const rawValue = value.closest("span");
      expect(rawValue).toHaveAttribute("data-raw-value", item.rawValue);
    }
  });

  test("should display error message when venue slug is not found", async () => {
    vi.spyOn(venueMethods, "getVenueDeliveryOrderInfo").mockImplementationOnce(
      () => {
        return Promise.reject(
          new Error("No venue with slug of 'non-existing-venue-slug' was found")
        );
      }
    );

    render(<PriceCalculator />);

    const user = userEvent.setup();
    const venueSlugField = screen.getByPlaceholderText("Enter venue slug");
    const cartValueField = screen.getByPlaceholderText("Enter cart value");
    const userLatitudeField = screen.getByPlaceholderText(
      "Enter user latitude"
    );
    const userLongitudeField = screen.getByPlaceholderText(
      "Enter user longitude"
    );

    await user.type(venueSlugField, "non-existing-venue-slug");
    await user.type(cartValueField, "5.93");
    await user.type(userLatitudeField, "60.1846967");
    await user.type(userLongitudeField, "24.9349696");

    const calculateButton = screen.getByText("Calculate delivery fee");
    await user.click(calculateButton);

    const errorMessage = await screen.findByText(
      "Cannot calculate the delivery fee. No venue with slug of 'non-existing-venue-slug' was found"
    );
    expect(errorMessage).toBeInTheDocument();
  });

  test("should display error message when delivery distance is out of range", async () => {
    vi.spyOn(venueMethods, "getVenueDeliveryOrderInfo").mockImplementationOnce(
      () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(testVenueDeliveryOrderInfo);
          }, 500);
        });
      }
    );

    render(<PriceCalculator />);

    const user = userEvent.setup();
    const venueSlugField = screen.getByPlaceholderText("Enter venue slug");
    const cartValueField = screen.getByPlaceholderText("Enter cart value");
    const userLatitudeField = screen.getByPlaceholderText(
      "Enter user latitude"
    );
    const userLongitudeField = screen.getByPlaceholderText(
      "Enter user longitude"
    );

    await user.type(venueSlugField, "home-assignment-venue-helsinki");
    await user.type(cartValueField, "5.93");
    await user.type(userLatitudeField, "60.2056874");
    await user.type(userLongitudeField, "24.9786396");

    const calculateButton = screen.getByText("Calculate delivery fee");
    await user.click(calculateButton);

    const errorMessage = await screen.findByText(
      "Cannot calculate the delivery fee. The delivery distance is too long (4846 m)."
    );
    expect(errorMessage).toBeInTheDocument();
  });
});
