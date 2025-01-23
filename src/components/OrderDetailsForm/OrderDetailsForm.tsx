import { AxiosError } from "axios";
import { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { getVenueDeliveryOrderInfo } from "../../api/venues";
import type { DeliveryOrderPrice } from "../../types/internal";
import { calculateDeliveryDistance } from "../../utils/calculateDeliveryDistance";
import { calculateDeliveryFee } from "../../utils/calculateDeliveryFee";
import { convertEuroToCent } from "../../utils/convertEuroCurrencyUnit";
import { getUserCoordinates } from "../../utils/getUserCoordinates";
import Field from "./Field";

interface FormProps {
  setDeliveryOrderPrice: (deliveryOrderPrice: DeliveryOrderPrice) => void;
  setError: (error: string) => void;
}

export type FormField = {
  label: string;
  inputType: string;
  id: string;
  placeHolder: string;
  defaultValue?: string;
  attribute?: { min: number };
};

interface FormValues {
  venueSlug: string;
  cartValue: string;
  userLatitude: string | number;
  userLongitude: string | number;
}

export function OrderDetailsForm({
  setDeliveryOrderPrice,
  setError,
}: FormProps) {
  const methods = useForm<FormValues>();
  const { setValue, handleSubmit } = methods;

  const [isGettingCoordinates, setIsGettingCoordinates] = useState(false);

  const formFields: FormField[] = [
    {
      label: "Venue slug",
      inputType: "text",
      id: "venueSlug",
      placeHolder: "Enter venue slug",
      defaultValue: "home-assignment-venue-helsinki",
    },
    {
      label: "Cart value",
      inputType: "number",
      id: "cartValue",
      placeHolder: "Enter cart value",
      attribute: { min: 1 },
    },
    {
      label: "User latitude",
      inputType: "number",
      id: "userLatitude",
      placeHolder: "Enter user latitude",
      // To-do: remove
      defaultValue: "60.161836",
    },
    {
      label: "User longitude",
      inputType: "number",
      id: "userLongitude",
      placeHolder: "Enter user longitude",
      // To-do: remove
      defaultValue: "24.9197347",
    },
  ];

  const handleClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    try {
      e.preventDefault();
      setIsGettingCoordinates(true);
      const { latitude, longitude } = await getUserCoordinates();

      setValue("userLatitude", latitude, {
        shouldValidate: true,
      });
      setValue("userLongitude", longitude, {
        shouldValidate: true,
      });
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
    } finally {
      setIsGettingCoordinates(false);
    }
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    // To-do: Double check
    // Keep this?
    // if (!venueSlug || !cartValue || !userLatitude || !userLongitude) return;

    try {
      const orderDetails = {
        venueSlug: data.venueSlug,
        cartValue: convertEuroToCent(Number(data.cartValue)),
        userLatitude: Number(data.userLatitude),
        userLongitude: Number(data.userLongitude),
      };

      const { venueSlug, cartValue, userLatitude, userLongitude } =
        orderDetails;

      const {
        venueLatitude,
        venueLongitude,
        distanceRanges,
        basePrice,
        orderMinimumNoSurcharge,
      } = await getVenueDeliveryOrderInfo(venueSlug);

      const deliveryDistance = calculateDeliveryDistance(
        {
          latitude: venueLatitude,
          longitude: venueLongitude,
        },
        {
          latitude: userLatitude,
          longitude: userLongitude,
        }
      );

      const { distanceOutOfDeliveryRange, deliveryFee } = calculateDeliveryFee(
        distanceRanges,
        deliveryDistance,
        basePrice
      );

      if (distanceOutOfDeliveryRange)
        setError("The location is outside of the delivery range.");
        // return here?

      const smallOrderSurcharge = Math.max(
        orderMinimumNoSurcharge - cartValue,
        0
      );
      const totalPrice = cartValue + smallOrderSurcharge + deliveryFee;

      setDeliveryOrderPrice({
        cartValue,
        smallOrderSurcharge,
        deliveryFee,
        deliveryDistance,
        totalPrice,
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        setError(error.response?.data.message || "Something went wrong.");
        console.error(error.message);
      }
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <h4>Order Details</h4>
          {formFields.map((field) => {
            return <Field field={field} key={field.label} />;
          })}
        </div>
        {/* missing data-test-id for button */}
        <button disabled={isGettingCoordinates} onClick={handleClick}>
          {isGettingCoordinates ? "Loading" : "Get location"}
        </button>
        {/* missing data-test-id for button */}
        <button disabled={isGettingCoordinates}>Calculate delivery fee</button>
      </form>
    </FormProvider>
  );
}
