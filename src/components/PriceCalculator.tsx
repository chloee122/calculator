import { useState } from "react";
import { ToastContainer, Slide } from "react-toastify";
import PriceBreakdown from "./PriceBreakdown";
import type { DeliveryOrderPrice } from "../types/internal";
import OrderDetailsForm from "./OrderDetailsForm/OrderDetailsForm";
import {
  ErrorContainer,
  ErrorIcon,
  PriceCalculatorContainer,
  Title,
  TitleContainer,
} from "./styles/PriceCalculator.styled";

function PriceCalculator() {
  const [deliveryOrderPrice, setDeliveryOrderPrice] =
    useState<DeliveryOrderPrice>({
      cartValue: 0,
      smallOrderSurcharge: 0,
      deliveryFee: 0,
      deliveryDistance: 0,
      totalPrice: 0,
    });
  const [error, setError] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  return (
    <PriceCalculatorContainer>
      <ToastContainer
        position="bottom-right"
        hideProgressBar
        closeOnClick
        pauseOnFocusLoss
        pauseOnHover
        theme="light"
        transition={Slide}
      />
      <TitleContainer>
        <Title>Delivery Order Price Calculator</Title>
      </TitleContainer>
      <OrderDetailsForm
        setDeliveryOrderPrice={setDeliveryOrderPrice}
        setError={setError}
        setIsCalculating={setIsCalculating}
      />
      {error ? (
        <ErrorContainer>
          <ErrorIcon />
          Cannot calculate the delivery fee.
          <br /> {error}
        </ErrorContainer>
      ) : (
        <PriceBreakdown
          deliveryOrderPrice={deliveryOrderPrice}
          isCalculating={isCalculating}
        />
      )}
    </PriceCalculatorContainer>
  );
}

export default PriceCalculator;
