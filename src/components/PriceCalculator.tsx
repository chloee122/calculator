import { useState } from "react";
import { ToastContainer, Slide } from "react-toastify";
import PriceBreakdown from "./PriceBreakdown";
import type { DeliveryOrderPrice } from "../types/internal";
import OrderDetailsForm from "./OrderDetailsForm/OrderDetailsForm";

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

  return (
    <div>
      <ToastContainer
        position="bottom-right"
        hideProgressBar
        closeOnClick
        pauseOnFocusLoss
        pauseOnHover
        theme="light"
        transition={Slide}
      />
      <h1>Delivery Order Price Calculator</h1>
      <OrderDetailsForm
        setDeliveryOrderPrice={setDeliveryOrderPrice}
        setError={setError}
      />
      {error ? (
        <div style={{ color: "red" }}>
          Cannot calculate the delivery fee. {error}
        </div>
      ) : (
        <PriceBreakdown deliveryOrderPrice={deliveryOrderPrice} />
      )}
    </div>
  );
}

export default PriceCalculator;
