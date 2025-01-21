import { useState } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { Input } from "./Input";
import { getUserCoordinates } from "../../utils/getUserCoordinates";
import type { DeliveryOrderPrice } from "../../types/internal";
import { calculateDeliveryDistance } from "../../utils/calculateDeliveryDistance";
import { calculateDeliveryFee } from "../../utils/calculateDeliveryFee";
import { getVenueDeliveryOrderInfo } from "../../api/venues";
import { convertEuroToCent } from "../../utils/convertEuroCurrencyUnit";

interface FormProps {
  setDeliveryOrderPrice: (deliveryOrderPrice: DeliveryOrderPrice) => void;
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

export function OrderDetailsForm({ setDeliveryOrderPrice }: FormProps) {
  const [shouldShowDeliveryDistanceAlert, setShouldShowDeliveryDistanceAlert] =
    useState(false);

  const methods = useForm<FormValues>();
  const { setValue, handleSubmit } = methods;

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
    },
    {
      label: "User longitude",
      inputType: "number",
      id: "userLongitude",
      placeHolder: "Enter user longitude",
    },
  ];

  const handleClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    try {
      e.preventDefault();
      const { latitude, longitude } = await getUserCoordinates();

      setValue("userLatitude", latitude, {
        shouldValidate: true,
      });
      setValue("userLongitude", longitude, {
        shouldValidate: true,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    // To-do: Double check
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

      setShouldShowDeliveryDistanceAlert(distanceOutOfDeliveryRange);

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
      console.error(error);
      // To-do: Handle case where venue slug is not found
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <h4>Order Details</h4>
          {formFields.map((field) => {
            return <Input field={field} key={field.label} />;
          })}
        </div>
        <button onClick={handleClick} value="Get location">
          Get location
        </button>
        <button value="Calculate delivery fee">Calculate delivery fee</button>
        <div style={{ color: "red" }}>
          {shouldShowDeliveryDistanceAlert &&
            "Cannot calculate delivery fee. The location is outside of the delivery range."}
        </div>
      </form>
    </FormProvider>
  );
}
