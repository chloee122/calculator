import { render, screen, waitFor } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import OrderDetailsForm from "./OrderDetailsForm";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";

const mockSetDeliveryOrderPrice = vi.fn();
const mockSetError = vi.fn();
const mockSetIsCalculating = vi.fn();

const TestComponent = () => {
  const methods = useForm();
  return (
    <FormProvider {...methods}>
      <OrderDetailsForm
        setDeliveryOrderPrice={mockSetDeliveryOrderPrice}
        setError={mockSetError}
        setIsCalculating={mockSetIsCalculating}
      />
    </FormProvider>
  );
};

const mockGeolocation = {
  getCurrentPosition: vi.fn((successCallback) => {
    setTimeout(() => {
      successCallback({
        coords: {
          latitude: 60.192059,
          longitude: 24.945831,
        },
      });
    }, 500);
  }),
};

Object.defineProperty(navigator, "geolocation", {
  value: mockGeolocation,
});

describe("OrderDetailsForm", () => {
  test("should show validation feedbacks when all fields are missing", async () => {
    render(<TestComponent />);

    const user = userEvent.setup();

    const venueSlugField = screen.getByPlaceholderText("Enter venue slug");
    await user.clear(venueSlugField);

    const button = screen.getByText("Calculate delivery fee");
    await user.click(button);

    expect(
      await screen.findByText("Venue slug is required")
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Cart value is required")
    ).toBeInTheDocument();
    expect(
      await screen.findByText("User latitude is required")
    ).toBeInTheDocument();
    expect(
      await screen.findByText("User longitude is required")
    ).toBeInTheDocument();
  });

  test("should show a specific validation feedback when cart value input is 0", async () => {
    render(<TestComponent />);

    const user = userEvent.setup();

    const cartValueField = screen.getByPlaceholderText("Enter cart value");
    await user.type(cartValueField, "0");

    const calculateButton = screen.getByText("Calculate delivery fee");
    await user.click(calculateButton);

    const errorMessage = screen.getByText("Cart value must be more than 0 EUR");
    expect(errorMessage).toBeInTheDocument();
  });

  test("should fill user latitude and longitude fields when clicking on 'Get location' button", async () => {
    render(<TestComponent />);

    const user = userEvent.setup();

    const getLocationButton = screen.getByText("Get location");
    await user.click(getLocationButton);

    expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled();

    await waitFor(() => {
      const latitudeField = screen.getByPlaceholderText("Enter user latitude");
      const longitudeField = screen.getByPlaceholderText(
        "Enter user longitude"
      );

      expect(latitudeField).toHaveValue(60.192059);
      expect(longitudeField).toHaveValue(24.945831);
    });
  });

  test("should disable 'Get location' and 'Calculate delivery' buttons while fetching the location", async () => {
    render(<TestComponent />);

    const user = userEvent.setup();

    const getLocationButton = screen.getByText("Get location");
    const calculateDeliveryButton = screen.getByText("Calculate delivery fee");

    expect(getLocationButton).toBeEnabled();
    expect(calculateDeliveryButton).toBeEnabled();

    await user.click(getLocationButton);

    expect(getLocationButton).toBeDisabled();
    expect(calculateDeliveryButton).toBeDisabled();

    await waitFor(() => {
      expect(getLocationButton).toBeEnabled();
      expect(calculateDeliveryButton).toBeEnabled();
    });
  });
});
