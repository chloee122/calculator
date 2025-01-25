import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";
import PriceCalculator from "./PriceCalculator";

describe("PriceCalculator", () => {
  test("should display a toast notification if permission to get location is denied/blocked", async () => {
    const mockGeolocation = {
      getCurrentPosition: vi.fn((_successCallback, errorCallback) => {
        errorCallback({
          code: 1,
          message: "User denied Geolocation",
          PERMISSION_DENIED: 1,
        });
      }),
    };

    Object.defineProperty(navigator, "geolocation", {
      value: mockGeolocation,
    });

    render(<PriceCalculator />);

    const user = userEvent.setup();

    const getLocationButton = screen.getByText("Get location");
    await user.click(getLocationButton);

    const toastMessage = screen.getByText(
      "Please turn on location sharing in your browser's settings."
    );

    expect(toastMessage).toBeInTheDocument();
  });

  // test.only("should display error message when endpoint returns other error", async () => {
  //   vi.mock("../api/venues", () => ({
  //     getVenueDeliveryOrderInfo: vi.fn(() =>
  //       Promise.reject(new Error("Internal server error"))
  //     ),
  //   }));

  //   render(<PriceCalculator />);

  //   const user = userEvent.setup();
  //   const venueSlugField = screen.getByPlaceholderText("Enter venue slug");
  //   const cartValueField = screen.getByPlaceholderText("Enter cart value");
  //   const userLatitudeField = screen.getByPlaceholderText(
  //     "Enter user latitude"
  //   );
  //   const userLongitudeField = screen.getByPlaceholderText(
  //     "Enter user longitude"
  //   );
  //   await user.clear(venueSlugField);
  //   await user.type(venueSlugField, "home-assignment-venue-helsinki");
  //   await user.type(cartValueField, "5.93");
  //   await user.type(userLatitudeField, "60.1846967");
  //   await user.type(userLongitudeField, "24.9349696");

  //   const calculateButton = screen.getByText("Calculate delivery fee");
  //   await user.click(calculateButton);

  //   const errorMessage = await screen.findByText(
  //     "Cannot calculate the delivery fee. Internal server error"
  //   );
  //   expect(errorMessage).toBeInTheDocument();
  // });

  test("should show price breakdown component on successful calculation", async () => {
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
    await user.clear(venueSlugField);
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
    await user.clear(venueSlugField);
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
    await user.clear(venueSlugField);
    await user.type(venueSlugField, "home-assignment-venue-helsinki");
    await user.type(cartValueField, "5.93");
    await user.type(userLatitudeField, "60.2056874");
    await user.type(userLongitudeField, "24.9786396");

    const calculateButton = screen.getByText("Calculate delivery fee");
    await user.click(calculateButton);

    const errorMessage = await screen.findByText(
      "Cannot calculate the delivery fee. This location is outside of the delivery range (4846 m)."
    );
    expect(errorMessage).toBeInTheDocument();
  });
});
