import { useReducer, useState } from "react";
import { getVenueInfo } from "../api/venues";
import { calculateDeliveryFee } from "../utils/calculateDeliveryFee";
import { calculateDeliveryDistance } from "../utils/calculateDeliveryDistance";
import {
  convertEuroToCent,
  convertCentToEuroString,
  convertCentToEuro,
} from "../utils/convertEuroCurrencyUnit";

type FormField = {
  label: string;
  inputType: string;
  id: keyof CalculatorFormState;
};

interface CalculatorFormState {
  venueSlug: string;
  cartValue: number;
  userLatitude: number;
  userLongitude: number;
}

const initialFormState: CalculatorFormState = {
  venueSlug: "",
  cartValue: 0,
  userLatitude: 0,
  userLongitude: 0,
};

enum CalculatorFormActionKind {
  HANDLE_INPUT = "handle_input",
}

interface CalculatorFormInputAction {
  type: CalculatorFormActionKind.HANDLE_INPUT;
  field: string;
  payload: string | number;
}

type CalculatorFormAction = CalculatorFormInputAction;

const calculatorFormReducer = (
  state: CalculatorFormState,
  action: CalculatorFormAction
) => {
  if (action.type === CalculatorFormActionKind.HANDLE_INPUT) {
    return { ...state, [action.field]: action.payload };
  }

  return state;
};

function OrderDetails() {
  const [calculatorFormState, dispatch] = useReducer(
    calculatorFormReducer,
    initialFormState
  );

  const [deliveryOrderPrice, setDeliveryOrderPrice] = useState({
    cartValue: "",
    smallOrderSurcharge: "",
    deliveryFee: "",
    deliveryDistance: 0,
    totalPrice: "",
  });

  const formFields: FormField[] = [
    { label: "Venue slug", inputType: "text", id: "venueSlug" },
    { label: "Cart value", inputType: "number", id: "cartValue" },
    { label: "User latitude", inputType: "number", id: "userLatitude" },
    { label: "User longitude", inputType: "number", id: "userLongitude" },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (id === "cartValue") {
      dispatch({
        type: CalculatorFormActionKind.HANDLE_INPUT,
        field: id,
        payload: convertEuroToCent(Number(value)),
      });
    } else {
      dispatch({
        type: CalculatorFormActionKind.HANDLE_INPUT,
        field: id,
        payload: id === "venueSlug" ? value : Number(value),
      });
    }
  };

  const formFieldContent = formFields.map((field) => {
    const isCartValue = field.id === "cartValue";
    return (
      <div key={field.label}>
        <label htmlFor={field.id}>{field.label}</label>
        <input
          value={
            isCartValue
              ? convertCentToEuro(calculatorFormState[field.id] as number)
              : calculatorFormState[field.id]
          }
          type={field.inputType}
          id={field.id}
          data-test-id={field.id}
          onChange={handleChange}
        />
      </div>
    );
  });

  const getUserCoordinates = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;

        dispatch({
          type: CalculatorFormActionKind.HANDLE_INPUT,
          field: "userLatitude",
          payload: latitude,
        });

        dispatch({
          type: CalculatorFormActionKind.HANDLE_INPUT,
          field: "userLongitude",
          payload: longitude,
        });
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    try {
      const venueInfo = await getVenueInfo(calculatorFormState.venueSlug);

      const deliveryDistance = calculateDeliveryDistance(
        {
          latitude: venueInfo.venueLatitude,
          longitude: venueInfo.venueLongitude,
        },
        {
          latitude: calculatorFormState.userLatitude,
          longitude: calculatorFormState.userLongitude,
        }
      );

      const deliveryFee = calculateDeliveryFee(
        venueInfo.distanceRanges,
        deliveryDistance,
        venueInfo.basePrice
      );

      const smallOrderSurcharge =
        venueInfo.orderMinimumNoSurcharge > calculatorFormState.cartValue
          ? venueInfo.orderMinimumNoSurcharge - calculatorFormState.cartValue
          : 0;

      const totalPrice =
        calculatorFormState.cartValue + smallOrderSurcharge + deliveryFee;

      const deliveryOrderPrice = {
        cartValue: convertCentToEuroString(calculatorFormState.cartValue),
        smallOrderSurcharge: convertCentToEuroString(smallOrderSurcharge),
        deliveryFee: convertCentToEuroString(deliveryFee),
        deliveryDistance,
        totalPrice: convertCentToEuroString(totalPrice),
      };

      setDeliveryOrderPrice(deliveryOrderPrice);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h4>Order Details</h4>
      <form>
        {formFieldContent}
        <button onClick={getUserCoordinates}>Get location</button>
        <button onClick={handleSubmit}>Calculate delivery fee</button>
      </form>

      <div>Cart Value: {deliveryOrderPrice.cartValue} EUR</div>
      <div>Delivery Fee: {deliveryOrderPrice.deliveryFee} EUR</div>
      <div>Distance: {deliveryOrderPrice.deliveryDistance} m</div>
      <div>
        Small Order Surcharge: {deliveryOrderPrice.smallOrderSurcharge} EUR
      </div>
      <div>Total: {deliveryOrderPrice.totalPrice} EUR</div>
    </div>
  );
}

export default OrderDetails;
