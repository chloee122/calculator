import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import Field from "./Field";
import { getUserCoordinates } from "../../utils/getUserCoordinates";
import type { DeliveryOrderPrice } from "../../types/internal";
import { calculateDeliveryDistance } from "../../utils/calculateDeliveryDistance";
import { calculateDeliveryFee } from "../../utils/calculateDeliveryFee";
import { getVenueDeliveryOrderInfo } from "../../api/venues";
import { convertEuroToCent } from "../../utils/convertEuroCurrencyUnit";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useState } from "react";
import {
  Button,
  FormContainer,
  Heading,
} from "../styles/OrderDetailsForm.styled";

interface FormProps {
  setDeliveryOrderPrice: (deliveryOrderPrice: DeliveryOrderPrice) => void;
  setError: (error: string | null) => void;
  setIsCalculating: (isCalculating: boolean) => void;
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

function OrderDetailsForm({
  setDeliveryOrderPrice,
  setError,
  setIsCalculating,
}: FormProps) {
  const methods = useForm<FormValues>();
  const { setValue, handleSubmit } = methods;

  const [isGettingCoordinates, setIsGettingCoordinates] = useState(false);

  const formFields: FormField[] = [
    {
      id: "venueSlug",
      label: "Venue slug",
      inputType: "text",
      placeHolder: "Enter venue slug",
    },
    {
      id: "cartValue",
      label: "Cart value",
      inputType: "number",
      placeHolder: "Enter cart value",
      attribute: { min: 1 },
    },
    {
      id: "userLatitude",
      label: "User latitude",
      inputType: "number",
      placeHolder: "Enter user latitude",
    },
    {
      id: "userLongitude",
      label: "User longitude",
      inputType: "number",
      placeHolder: "Enter user longitude",
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
    try {
      setIsCalculating(true);
      setError(null);

      const venueSlug = data.venueSlug;
      const cartValue = convertEuroToCent(Number(data.cartValue));
      const userLatitude = Number(data.userLatitude);
      const userLongitude = Number(data.userLongitude);

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

      const deliveryFee = calculateDeliveryFee(
        distanceRanges,
        deliveryDistance,
        basePrice
      );

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
      } else if (error instanceof Error) {
        setError(error.message || "Something went wrong");
      }
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <FormContainer>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div>
            <Heading>Order Details</Heading>
            {formFields.map((field) => {
              return <Field key={field.label} field={field} />;
            })}
          </div>
          <Button
            data-test-id="getLocation"
            id="getLocation"
            disabled={isGettingCoordinates}
            onClick={handleClick}
          >
            {isGettingCoordinates ? "Loading" : "Get location"}
          </Button>
          <Button
            data-test-id="calculateDeliveryPrice"
            id="calculateDeliveryPrice"
            disabled={isGettingCoordinates}
          >
            Calculate delivery fee
          </Button>
        </form>
      </FormContainer>
    </FormProvider>
  );
}

export default OrderDetailsForm;
