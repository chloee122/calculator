import { useReducer, useState } from "react";
import { getVenueInfo } from "../api/venues";
import { calculateDeliveryFee } from "../utils/calculateDeliveryFee";
import { calculateDeliveryDistance } from "../utils/calculateDeliveryDistance";
import {
  convertEuroToCent,
  convertCentToEuro,
} from "../utils/convertEuroCurrencyUnit";
import { getUserCoordinates } from "../utils/getUserCoordinates";
import {
  FormField,
  OrderDetailsFormActionKind,
  OrderDetailsFormAction,
  OrderDetailsFormState,
} from "./OrderDetails.types";

const initialOrderDetailsFormState: OrderDetailsFormState = {
  venueSlug: "",
  cartValue: null,
  userLatitude: null,
  userLongitude: null,
};

const orderDetailsFormReducer = (
  state: OrderDetailsFormState,
  action: OrderDetailsFormAction
) => {
  if (
    action.type === OrderDetailsFormActionKind.HANDLE_STRING_INPUT ||
    action.type === OrderDetailsFormActionKind.HANDLE_NUMBER_INPUT
  ) {
    return { ...state, [action.field]: action.payload };
  }

  return state;
};

function OrderDetails() {
  const [orderDetailsFormState, dispatch] = useReducer(
    orderDetailsFormReducer,
    initialOrderDetailsFormState
  );

  const [deliveryOrderPrice, setDeliveryOrderPrice] = useState({
    cartValue: 0,
    smallOrderSurcharge: 0,
    deliveryFee: 0,
    deliveryDistance: 0,
    totalPrice: 0,
  });

  const [shouldShowDeliveryDistanceAlert, setShouldShowDeliveryDistanceAlert] =
    useState(false);

  const formFields: FormField[] = [
    { label: "Venue slug", inputType: "text", id: "venueSlug" },
    { label: "Cart value", inputType: "number", id: "cartValue" },
    { label: "User latitude", inputType: "number", id: "userLatitude" },
    { label: "User longitude", inputType: "number", id: "userLongitude" },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    if (id === "venueSlug") {
      dispatch({
        type: OrderDetailsFormActionKind.HANDLE_STRING_INPUT,
        field: id,
        payload: value,
      });
    } else if (id === "cartValue") {
      dispatch({
        type: OrderDetailsFormActionKind.HANDLE_NUMBER_INPUT,
        field: id,
        payload: value !== "" ? convertEuroToCent(Number(value)) : null,
      });
    } else {
      dispatch({
        type: OrderDetailsFormActionKind.HANDLE_NUMBER_INPUT,
        field: id,
        payload: value !== "" ? Number(value) : null,
      });
    }
  };

  // To-do: Refactor to a reusable Input component to include validation feedback
  const formFieldContent = formFields.map((field) => {
    const inputValue = orderDetailsFormState[field.id];
    let formattedInputValue;
    if (field.id === "venueSlug") {
      formattedInputValue = inputValue || "";
    }

    if (field.id === "cartValue") {
      formattedInputValue =
        inputValue !== null ? convertCentToEuro(inputValue as number) : "";
    }

    if (field.id === "userLatitude" || field.id === "userLongitude") {
      formattedInputValue = inputValue !== null ? inputValue : "";
    }

    return (
      <div key={field.label}>
        <label htmlFor={field.id}>{field.label}</label>
        {/* To-do: Add min limit to input to prevent negative value */}
        <input
          required
          value={formattedInputValue}
          type={field.inputType}
          id={field.id}
          data-test-id={field.id}
          onChange={handleChange}
        />
      </div>
    );
  });

  const handleClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    try {
      e.preventDefault();
      const { latitude, longitude } = await getUserCoordinates();

      dispatch({
        type: OrderDetailsFormActionKind.HANDLE_NUMBER_INPUT,
        field: "userLatitude",
        payload: latitude,
      });

      dispatch({
        type: OrderDetailsFormActionKind.HANDLE_NUMBER_INPUT,
        field: "userLongitude",
        payload: longitude,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const { venueSlug, cartValue, userLatitude, userLongitude } =
        orderDetailsFormState;
      // To-do: Handle missing field and case where number inputs are 0
      if (!venueSlug || !cartValue || !userLatitude || !userLongitude) return;

      const venueInfo = await getVenueInfo(venueSlug);

      const deliveryDistance = calculateDeliveryDistance(
        {
          latitude: venueInfo.venueLatitude,
          longitude: venueInfo.venueLongitude,
        },
        {
          latitude: userLatitude,
          longitude: userLongitude,
        }
      );

      const { distanceOutOfDeliveryRange, deliveryFee } = calculateDeliveryFee(
        venueInfo.distanceRanges,
        deliveryDistance,
        venueInfo.basePrice
      );

      setShouldShowDeliveryDistanceAlert(distanceOutOfDeliveryRange);

      const smallOrderSurcharge =
        venueInfo.orderMinimumNoSurcharge > cartValue
          ? venueInfo.orderMinimumNoSurcharge - cartValue
          : 0;

      const totalPrice = cartValue + smallOrderSurcharge + deliveryFee;

      const deliveryOrderPrice = {
        cartValue,
        smallOrderSurcharge,
        deliveryFee,
        deliveryDistance,
        totalPrice,
      };
      setDeliveryOrderPrice(deliveryOrderPrice);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h4>Order Details</h4>
      <form onSubmit={handleSubmit}>
        {formFieldContent}
        <button onClick={handleClick} value="Get location">
          Get location
        </button>
        <button value="Calculate delivery fee">Calculate delivery fee</button>
      </form>

      <div>
        {shouldShowDeliveryDistanceAlert &&
          "Cannot calculate delivery fee. The location is outside of the delivery range."}
      </div>
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
